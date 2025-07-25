import * as React from "react";
import { useMemo } from "react";
import * as styles from "./task-list-table.module.css";
import { Task } from "../types";

const localeDateStringCache: Record<string, string> = {};

const toLocaleDateStringFactory =
  (locale: string) =>
    (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
      const key = date.toString();
      let lds = localeDateStringCache[key];
      if (!lds) {
        lds = date.toLocaleDateString(locale, dateTimeOptions);
        localeDateStringCache[key] = lds;
      }
      return lds;
    };

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
}) => {
    const toLocaleDateString = useMemo(
      () => toLocaleDateStringFactory(locale),
      [locale]
    );

    return (
      <div
        className={styles.taskListWrapper}
        style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
        }}
      >
        {tasks.map(t => {
          let expanderSymbol = "";
          if (t.hideChildren === false) {
            expanderSymbol = "▼";
          } else if (t.hideChildren === true) {
            expanderSymbol = "▶";
          }

          // console.log("Value of t.heirarchy level (t-list):", t.heirarchyLevel);
          const indentPx = (t.heirarchyLevel || 0) * 20;

          let taskProgressComplete: () => boolean = () => {
            if (t.progress) {
              return t.progress === 100;
            }
            return false;
          };

          return (
            <div
              className={styles.taskListTableRow}
              style={{ height: rowHeight }}
              key={`${t.id}row`}
            >

              <div
                className={styles.taskListCell}
                // className={`${styles.taskListCell} ${t.type === "project" ? styles.projectName : ""}`} copilot gave this code, still dont know what it does
                style={{
                  minWidth: rowWidth,
                  maxWidth: rowWidth,
                  fontWeight: t.type === "project" ? "bold" : "normal",
                  textTransform: t.type === "project" ? "uppercase" : "none",
                }}
                title={t.name.toUpperCase()}
              >
                {/* {t.name} */}

                <div className={styles.taskListNameWrapper}>
                  <div style={{ width: `${indentPx}px`, flexShrink: 0 }} />
                  <div
                    className={
                      expanderSymbol
                        ? styles.taskListExpander
                        : styles.taskListEmptyExpander
                    }
                    onClick={() => onExpanderClick(t)}
                  >
                    {expanderSymbol}
                  </div>
                  <div className={taskProgressComplete() ? styles.taskListOnComplete : "" }>{t.name}</div>
                </div>
              </div>
              {/* <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
            </div> */}
              {/* <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
            </div> */}
            </div>
          );
        })}
      </div>
    );
  };
