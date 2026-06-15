"""
PESTIQ 감지 이벤트 시뮬레이터
==============================
실제 라즈베리파이가 AI로 해충을 감지했을 때 Supabase로 보내는 요청을
흉내 내는 테스트용 스크립트입니다.

사용법:
    pip install supabase
    python simulate_detection.py

환경변수 (.env 또는 직접 export):
    SUPABASE_URL=https://xxxxxxxx.supabase.co
    SUPABASE_ANON_KEY=eyJxxxxxxxx...

실제 기기에서는 AI 모델이 해충을 감지(YOLOv8 등)한 직후,
이 스크립트의 insert_detection() 부분과 동일한 코드를
PESTIQ 펌웨어(라즈베리파이 Python 코드)에 넣으면 됩니다.
"""

import os
import random
import time
from datetime import datetime, timezone

from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://YOUR_PROJECT.supabase.co")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "YOUR_ANON_KEY")

DEVICE_ID = os.environ.get("DEVICE_ID", "cockroach-kitchen-01")
PEST_TYPE = os.environ.get("PEST_TYPE", "roach")  # roach | mosquito | fly
VIDEO_FILE = os.environ.get("VIDEO_FILE", "")  # 업로드할 영상 파일 경로 (선택)
LOCATIONS = ["주방", "욕실", "거실", "침실"]


def upload_video(client, file_path: str):
    """
    감지 영상을 Supabase Storage(detection-videos 버킷)에 업로드하고
    공개 URL을 반환합니다.

    실제 라즈베리파이에서는 감지 시점부터 흡입/분사 완료까지의 짧은 영상을
    .mp4로 저장한 뒤 이 함수와 동일한 방식으로 업로드하면 됩니다.
    """
    import os as _os

    if not file_path or not _os.path.exists(file_path):
        return None

    ext = _os.path.splitext(file_path)[1] or ".mp4"
    storage_path = f"{DEVICE_ID}/{int(time.time())}{ext}"

    with open(file_path, "rb") as f:
        client.storage.from_("detection-videos").upload(
            storage_path, f, {"content-type": "video/mp4"}
        )

    public_url = client.storage.from_("detection-videos").get_public_url(storage_path)
    print(f"[영상 업로드] {storage_path} -> {public_url}")
    return public_url


def insert_detection(client, pest_type: str, location: str, count: int = 1, video_url: str | None = None):
    """감지 이벤트 1건을 detections 테이블에 기록"""
    payload = {
        "device_id": DEVICE_ID,
        "pest_type": pest_type,
        "location": location,
        "count": count,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "video_url": video_url,
    }
    res = client.table("detections").insert(payload).execute()
    print(f"[감지 기록] {payload}")
    return res


def update_device_status(client, chemical_level: int, battery_level: int, status: str = "normal"):
    """기기 상태(약품/배터리 잔량)를 device_status 테이블에 갱신 (upsert)"""
    payload = {
        "device_id": DEVICE_ID,
        "chemical_level": chemical_level,
        "battery_level": battery_level,
        "status": status,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    res = client.table("device_status").upsert(payload).execute()
    print(f"[상태 갱신] {payload}")
    return res


def main():
    if SUPABASE_URL.startswith("https://YOUR_PROJECT"):
        print("SUPABASE_URL / SUPABASE_ANON_KEY 환경변수를 설정해주세요.")
        return

    client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

    # 기기 상태 한 번 갱신
    update_device_status(client, chemical_level=random.randint(50, 100), battery_level=random.randint(60, 100))

    # 감지 영상 업로드 (VIDEO_FILE 환경변수로 경로를 지정한 경우만)
    video_url = upload_video(client, VIDEO_FILE)

    # 감지 이벤트 1건 생성 (실제로는 AI가 해충을 인식했을 때 1회 호출)
    location = random.choice(LOCATIONS)
    insert_detection(client, PEST_TYPE, location, count=1, video_url=video_url)

    print("완료. Supabase Table Editor에서 detections / device_status 테이블을 확인하세요.")


if __name__ == "__main__":
    main()
