"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.scss";

let url = process.env.NEXT_PUBLIC_BASE_URL;
type Score = {
  _id: string;
  name: string;
  duration: string;
  score: number;
};

const ScoreBoard = () => {
  const [sortedData, setSortedData] = useState<Score[]>([]);
  const [data, setData] = useState<Score[]>([]);

  useEffect(() => {
    axios
      .get(url + "/scores/allScores")
      .then((res) => {
        console.log({ res });
        setData(res?.data);
      })
      .catch((error) => {
        console.log({ error });
      });
  }, []);

  useEffect(() => {
    // Sort the data based on duration
    const sorted: Score[] = data.slice().sort((a, b) => {
      const aDuration =
        a?.duration === "0:00" ? 0 : convertDurationToSeconds(a.duration);
      const bDuration =
        b?.duration === "0:00" ? 0 : convertDurationToSeconds(b.duration);
      return aDuration - bDuration;
    });
    setSortedData(sorted);
  }, [data]);

  const convertDurationToSeconds = (duration: string) => {
    const parts = duration.split(":");
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return minutes * 60 + seconds;
  };

  return (
    <>
      <h2 className={styles.heading}>Score Board</h2>



      <table className={[styles.border, styles.main_table, styles.best_score].join(' ')}>
        <thead>
          <tr>
            <th className={styles.border} colSpan={3}>Best Score</th>
           
          </tr>
        </thead>
        <tbody>
          <tr key={sortedData[0]?._id}>
            <td className={styles.border}>{sortedData[0]?.name}</td>
            <td className={styles.border}>{sortedData[0]?.duration}</td>
            <td className={styles.border}>{sortedData[0]?.score}</td>
          </tr>
        </tbody>
      </table>

      <table className={styles.border + " " + styles.main_table}>
        <thead>
          <tr>
            <th className={styles.border}>Name</th>
            <th className={styles.border}>Duration</th>
            <th className={styles.border}>Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item._id}>
              <td className={styles.border}>{item.name}</td>
              <td className={styles.border}>{item.duration}</td>
              <td className={styles.border}>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ScoreBoard;
