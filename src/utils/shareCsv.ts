import {
  cacheDirectory,
  EncodingType,
  writeAsStringAsync,
} from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export async function shareOrDownloadCsv(
  csv: string,
  filename = "pocketlog-transactions.csv"
) {
  if (Platform.OS === "web") {
    if (typeof document !== "undefined") {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    return;
  }

  const base = cacheDirectory;
  if (!base) {
    throw new Error("Cache directory is not available.");
  }
  const path = `${base}${filename}`;
  await writeAsStringAsync(path, csv, {
    encoding: EncodingType.UTF8,
  });
  const can = await Sharing.isAvailableAsync();
  if (can) {
    await Sharing.shareAsync(path, {
      mimeType: "text/csv",
      dialogTitle: "Export transactions",
    });
  }
}
