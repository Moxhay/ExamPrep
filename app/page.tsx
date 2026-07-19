import { redirect } from 'next/navigation'
import { EXAM_PATH } from './const'

export default function Home() {
  redirect(EXAM_PATH)
}
