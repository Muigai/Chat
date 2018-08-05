
import {A0, F0} from "rahisi-type-utils";

export const delay = (milliseconds: number, count: number): Promise<number> =>
new Promise<number>((resolve) => {
    setTimeout(() => {
        resolve(count);
    }, milliseconds);
});

export const runTask =
(task: A0, timeout: number, shouldCancel: F0<boolean> = () => false) => {
    setTimeout(
        () => {

            if (shouldCancel()) {
                return;
            }

            task();
        }
        ,
        timeout);
};
