import {useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import prism from "prismjs"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"   // must come after prism-c
import "prismjs/components/prism-go"
import editor from "react-simple-code-editor"
import './App.css'
import { parse, Allow } from "partial-json"

const Editor = editor.default


function App() {
  const [review, setReview] =useState({summary: "",score: 0,issues: []})
  const [errorMessage, setErrorMessage] = useState("");
  const [loading,setLoading] =useState(false)
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState( `function sum(){return 1+1}` )
  const [streamText, setStreamText] = useState("");

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode(){
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/ai/get-review", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ code, language })});
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
      try {
        const partial = parse(fullText, Allow.OBJ | Allow.ARR | Allow.STR);
        setReview({
          summary: partial.summary ?? "",
          score: partial.score ?? 0,
          issues: partial.issues ?? [],
        });
      } catch {
        
      }
    }
  
      setReview(JSON.parse(fullText));

    }
    catch (error) {
      console.error("Review error:", error);
      setErrorMessage(error.message || "Something went wrong.");
    }
    finally{
        setLoading(false);
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <label htmlFor="language">Language:</label>
            <select id="language" name="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="JavaScript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="typescript">TypeScript</option>
            </select>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code =>
                prism.highlight(
                  code,
                  prism.languages[language]||prism.languages.javascript,
                  language
                )
              }
              padding={10}
              style={{
                fontFamily: 'Consolas, "Courier New", monospace',
                width:'100%'
              }}
            />
          </div>

          <button className="review" onClick={reviewCode} disabled={loading}>{loading ? "Reviewing..." : "Review Code"}</button>
        </div>

        <div className="right">
          {errorMessage && <p className="error">{errorMessage}</p>}
          {
            (loading || review.summary || review.issues.length > 0) && (
              <div className="response">
                <h2>Code Review Results</h2>
                <h4>Summary:</h4>
                <br></br>
                <p>{review.summary}{loading && <span className="cursor">▍</span>}</p>
                <br></br>

                {!loading && <h4>Score: {review.score}</h4>}
                <br></br>

                <h4>Issues Found: {review.issues.length}</h4>
                {review.issues.map((issue,index) => (
                  <div className="issue" key={index}>
                    <h5>Issue: {issue.problem ?? "..."}</h5>
                    {issue.line != null && <p><strong>Line:</strong> {issue.line}</p>}
                    {issue.severity && <p><strong>Severity:</strong> {issue.severity}</p>}{issue.category && <p><strong>Category:</strong> {issue.category}</p>}{issue.fix && <p><strong>Suggested Fix:</strong> {issue.fix}</p>}
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </main>
    </>
  )
}

export default App


