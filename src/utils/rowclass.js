export function getRowClass({
  row,
  column,
  rowIndex,
  columnIndex
}) {
  if (rowIndex === 0) {
    return "background:#409EFF;color:#FFF;text-align:center;font-size:13px;font-weight:500;";
  } else {
    if (rowIndex % 2 === 0) {
      return "background:#fAeAeA;";
    } else {
      return "";
    }
  }
}
