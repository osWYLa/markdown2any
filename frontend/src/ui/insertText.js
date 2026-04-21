export function handleEditorAction(type, markdownContent, setMarkdownContent, editorRef, t) {
  const textarea = editorRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selection = markdownContent.substring(start, end);
  const before = markdownContent.substring(0, start);
  const after = markdownContent.substring(end);

  let newText = '';
  let selectionOffset = 0;
  let selectionLength = 0;

  switch (type) {
    case 'bold':
      newText = `**${selection || t('toolbar.boldText')}**`;
      selectionOffset = 2;
      selectionLength = selection ? selection.length : t('toolbar.boldText').length;
      break;
    case 'italic':
      newText = `*${selection || t('toolbar.italicText')}*`;
      selectionOffset = 1;
      selectionLength = selection ? selection.length : t('toolbar.italicText').length;
      break;
    case 'underline':
      newText = `<u>${selection || t('toolbar.underlineText')}</u>`;
      selectionOffset = 3;
      selectionLength = selection ? selection.length : t('toolbar.underlineText').length;
      break;
    case 'strikethrough':
      newText = `~~${selection || t('toolbar.strikethroughText')}~~`;
      selectionOffset = 2;
      selectionLength = selection ? selection.length : t('toolbar.strikethroughText').length;
      break;
    case 'h1':
      newText = `\n# ${selection || t('toolbar.h1Text')}\n`;
      selectionOffset = 3;
      selectionLength = selection ? selection.length : t('toolbar.h1Text').length;
      break;
    case 'h2':
      newText = `\n## ${selection || t('toolbar.h2Text')}\n`;
      selectionOffset = 4;
      selectionLength = selection ? selection.length : t('toolbar.h2Text').length;
      break;
    case 'h3':
      newText = `\n### ${selection || t('toolbar.h3Text')}\n`;
      selectionOffset = 5;
      selectionLength = selection ? selection.length : t('toolbar.h3Text').length;
      break;
    case 'quote':
      newText = `\n> ${selection || t('toolbar.quoteText')}\n`;
      selectionOffset = 3;
      selectionLength = selection ? selection.length : t('toolbar.quoteText').length;
      break;
    case 'code':
      newText = `\`${selection || t('toolbar.codeText')}\``;
      selectionOffset = 1;
      selectionLength = selection ? selection.length : t('toolbar.codeText').length;
      break;
    case 'codeblock':
      newText = `\n\`\`\`javascript\n${selection || t('toolbar.codeblockText')}\n\`\`\`\n`;
      selectionOffset = 15;
      selectionLength = selection ? selection.length : t('toolbar.codeblockText').length;
      break;
    case 'link':
      newText = `[${selection || t('toolbar.linkText')}](https://)`;
      selectionOffset = 1;
      selectionLength = selection ? selection.length : t('toolbar.linkText').length;
      break;
    case 'image':
      newText = `![${selection || t('toolbar.imageText')}](https://)`;
      selectionOffset = 2;
      selectionLength = selection ? selection.length : t('toolbar.imageText').length;
      break;
    case 'ul':
      newText = `\n- ${selection || t('toolbar.listText')}\n`;
      selectionOffset = 3;
      selectionLength = selection ? selection.length : t('toolbar.listText').length;
      break;
    case 'ol':
      newText = `\n1. ${selection || t('toolbar.listText')}\n`;
      selectionOffset = 4;
      selectionLength = selection ? selection.length : t('toolbar.listText').length;
      break;
    case 'table':
      newText = `\n| ${t('toolbar.col1')} | ${t('toolbar.col2')} |\n| --- | --- |\n| ${t('toolbar.cell')} | ${t('toolbar.cell')} |\n`;
      selectionOffset = 3;
      selectionLength = t('toolbar.col1').length;
      break;
    default:
      return;
  }

  setMarkdownContent(before + newText + after);

  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + selectionOffset, start + selectionOffset + selectionLength);
  }, 0);
}
