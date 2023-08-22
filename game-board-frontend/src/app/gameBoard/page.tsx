"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import knight from "../../../public/assets/images/knight.png";
import collectable from "../../../public/assets/images/collectable.png";
import danger from "../../../public/assets/images/danger.png";
import styles from "./page.module.scss";

type Position = {
  row: number;
  col: number;
};

const numRows = 20;
const numColumns = 20;
const collectedItems = 20;
const enemyItems = 15;
let firstPrint = 0;
let itemPositionCount = 0;

const randomPosition = (): Position => {
  return {
    row: Math.floor(Math.random() * numRows),
    col: Math.floor(Math.random() * numColumns),
  };
};

let url = process.env.NEXT_PUBLIC_BASE_URL;
const GameBoard = () => {
  const [playerPosition, setPlayerPosition] = useState({ row: 0, col: 0 });
  const [itemPositions, setItemPositions] = useState<Position[]>([]);
  const [enemyPositions, setEnemyPositions] = useState<Position[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const newItemPositions = Array.from({ length: collectedItems }, () =>
      randomPosition()
    );
    setItemPositions(newItemPositions);

    // Generate an array of random enemy positions with a specific length
    const newEnemyPositions = Array.from({ length: enemyItems }, () =>
      randomPosition()
    );
    setEnemyPositions(newEnemyPositions);
  }, []);

  useEffect(() => {
    let interval: any;
    if (timer === 0) {
      setTimer(1);
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    const handleKeyDown = (event: any) => {
      const { key } = event;
      let newRow = playerPosition.row;
      let newCol = playerPosition.col;

      switch (key) {
        case "ArrowUp":
          newRow = Math.max(0, newRow - 1);
          break;
        case "ArrowDown":
          newRow = Math.min(numRows - 1, newRow + 1);
          break;
        case "ArrowLeft":
          newCol = Math.max(0, newCol - 1);
          break;
        case "ArrowRight":
          newCol = Math.min(numColumns - 1, newCol + 1);
          break;
        default:
          return;
      }
      const matchedItem = itemPositions.some(
        (item) => item.row === newRow && item.col === newCol
      );
      const mathcedEnemy = enemyPositions.some(
        (enemy) => enemy.row === newRow && enemy.col === newCol
      );

      const matchedItemIndex = itemPositions.findIndex(
        (item) => item.row === newRow && item.col === newCol
      );

      if (matchedItemIndex !== -1) {
        // Remove the matched item from the array
        itemPositions.splice(matchedItemIndex, 1);
        setItemPositions(itemPositions);
      }

      if (matchedItem) {
        setScore(score + 1);
      }

      if (mathcedEnemy) {
        addScore();
        setTimer(0);
        setScore(0);
        alert("Game Over");
        router.push("/");
      }
      setPlayerPosition({ row: newRow, col: newCol });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition]);

  useEffect(() => {
    console.log(score, itemPositionCount);
    if (score === itemPositionCount && score !== 0 && itemPositionCount !== 0) {
      console.log("djajdk");
      addScore();
      setTimer(0);
      setScore(0);
      router.push("/scoreBoard");
    }
  }, [score, itemPositions]);

  const renderRows = () => {
    const rows = [];

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const cells = [];

      for (let colIndex = 0; colIndex < numColumns; colIndex++) {
        const cellClassName = `row${rowIndex + 1} col${colIndex + 1} ${
          playerPosition.row === rowIndex && playerPosition.col === colIndex
            ? "selected"
            : ""
        }`;

        const isPlayer =
          playerPosition.row === rowIndex && playerPosition.col === colIndex;
        const isItem = itemPositions.some(
          (item) =>
            (item.row === rowIndex && item.col === colIndex) ||
            (item.row === 0 && item.col === 0)
        );
        const isEnemy = enemyPositions.some(
          (enemy) =>
            (enemy.row === rowIndex && enemy.col === colIndex) ||
            (enemy.row === 0 && enemy.col === 0)
        );

        let cellContent;

        if (isPlayer) {
          cellContent = (
            <Image
              src={knight}
              alt={`Image ${rowIndex}-${colIndex}`}
              className={styles.game_img}
            />
          );
        } else if (isEnemy) {
          cellContent = (
            <Image
              src={danger}
              alt={`Image ${rowIndex}-${colIndex}`}
              className={styles.game_img}
            />
          );
        } else if (isItem) {
          if (firstPrint == 0) {
            itemPositionCount++;
          }

          cellContent = (
            <Image
              src={collectable}
              alt={`Image ${rowIndex}-${colIndex}`}
              className={styles.game_img}
            />
          );
        } else {
          cellContent = "";
        }

        cells.push(
          <td key={colIndex} className={cellClassName + " " + styles.box}>
            {cellContent}
          </td>
        );
      }
      if (firstPrint == 0) {
        setTimeout(() => {
          firstPrint += 1;
        }, 500);
      }
      const rowClassName = `row${rowIndex + 1}`;
      rows.push(
        <tr key={rowIndex} className={rowClassName}>
          {cells}
        </tr>
      );
    }

    return rows;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const addScore = () => {
    let gameScore = { name: "player", duration: formatTime(timer), score };
    axios
      .post(url + "/scores/addsScore", gameScore)
      .then((res) => {
        console.log({ res });
      })
      .catch((error) => {
        console.log({ error });
      });

    console.log({ gameScore });
  };
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h3>Score: {score}</h3>
        <h3>Timer: {formatTime(timer)}</h3>
      </div>
      <div className={styles.board_wrapper}>
        <table className={styles.main_board}>
          <tbody>{renderRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default GameBoard;
