import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 리포지토리 이름으로 base를 설정하세요.
// 예: 리포지토리가 https://github.com/USERNAME/crittercatch 이면
//     base: '/crittercatch/'
export default defineConfig({
  plugins: [react()],
  base: '/crittercatch/',
})
