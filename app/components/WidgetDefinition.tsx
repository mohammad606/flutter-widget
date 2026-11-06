import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type WidgetDefinitionProps = {
  description: string;
  code: string;
};

export function WidgetDefinition({ description, code }: WidgetDefinitionProps) {
  return (
    <>
      <p
        className="mb-5 text-base leading-7 text-slate-300"
        dir="auto"
        style={{ unicodeBidi: "plaintext", textAlign: "start" }}
      >
        {description}
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
        <SyntaxHighlighter
          language="dart"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "#020817",
            fontSize: "0.82rem",
            lineHeight: "1.8",
            overflowX: "auto",
            textAlign: "left",
            direction: "ltr",
          }}
          showLineNumbers={false}
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </>
  );
}
