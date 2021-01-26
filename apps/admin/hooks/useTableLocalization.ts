import type { Localization } from '@technote-space/material-table';
import { useMemo } from 'react';

const localization = (): Localization => useMemo(() => ({
  error: 'エラー',
  body: {
    emptyDataSourceMessage: '表示するレコードがありません。',
    filterRow: {
      filterPlaceHolder: '',
      filterTooltip: 'フィルター',
    },
    editRow: {
      saveTooltip: '保存',
      cancelTooltip: 'キャンセル',
      deleteText: 'この行を削除しますか？',
    },
    addTooltip: '追加',
    deleteTooltip: '削除',
    editTooltip: '編集',
  },
  header: {
    actions: 'アクション',
  },
  grouping: {
    groupedBy: 'グループ化:',
    placeholder: 'ヘッダーをドラッグ ...',
  },
  pagination: {
    firstTooltip: '最初のページ',
    firstAriaLabel: '最初のページ',
    previousTooltip: '前のページ',
    previousAriaLabel: '前のページ',
    nextTooltip: '次のページ',
    nextAriaLabel: '次のページ',
    labelDisplayedRows: '{from}-{to} 全{count}件',
    labelRowsPerPage: 'ページあたりの行数:',
    lastTooltip: '最後のページ',
    lastAriaLabel: '最後のページ',
    labelRowsSelect: '行',
  },
  toolbar: {
    addRemoveColumns: '列の追加、削除',
    nRowsSelected: '{0} 行選択',
    showColumnsTitle: '列の表示',
    showColumnsAriaLabel: '列の表示',
    exportTitle: '出力',
    exportAriaLabel: '出力',
    exportCSVName: 'CSV出力',
    exportPDFName: 'PDF出力',
    searchTooltip: '検索',
    searchPlaceholder: '検索',
    searchAriaLabel: '検索',
    clearSearchAriaLabel: 'クリア',
  },
} as Localization), []);

export default localization;
