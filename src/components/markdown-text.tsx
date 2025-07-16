interface MarkdownTextProps {
  children: string;
  className?: string;
}

export function MarkdownText({ children, className = '' }: MarkdownTextProps) {
  // Convert markdown-style formatting to HTML
  const processText = (text: string) => {
    // Convert **text** to <strong>text</strong>
    let processed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert bullet points to proper list items
    if (processed.includes('•')) {
      const lines = processed.split('\n');
      let inList = false;
      let result = '';
      
      for (const line of lines) {
        if (line.trim().startsWith('•')) {
          if (!inList) {
            result += '<ul class="list-disc list-inside space-y-1 my-2">';
            inList = true;
          }
          result += `<li class="ml-4">${line.trim().substring(1).trim()}</li>`;
        } else {
          if (inList) {
            result += '</ul>';
            inList = false;
          }
          if (line.trim()) {
            result += `<p class="mb-2">${line}</p>`;
          }
        }
      }
      
      if (inList) {
        result += '</ul>';
      }
      
      return result;
    }
    
    return processed;
  };

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: processText(children) }}
    />
  );
}