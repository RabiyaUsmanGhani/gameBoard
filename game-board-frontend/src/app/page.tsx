import Image from 'next/image'
import styles from './page.module.scss'
import Link from "next/link";
import dotenv from "dotenv";
dotenv.config();

export default function Home() {
  return (
    <main >
     <div className={styles.bgImage}>
     <Link href={"/gameBoard"}>
       <button className={styles.start_btn}>
        Start Game
       </button>
       </Link>
     <Link href={"/scoreBoard"}>
       <button className={styles.start_btn}>
        Score Board
       </button>
       </Link>
       
     </div>
    </main>
  )
}
