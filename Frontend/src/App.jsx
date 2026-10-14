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

const Editor = editor.default


function App() {
  const [review, setReview] =useState({summary: "",score: 0,issues: []})
  const [errorMessage, setErrorMessage] = useState("");
  const [loading,setLoading] =useState(false)
  const [language, setLanguage] = useState("Javascript")
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
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      setStreamText(prev => prev + chunk);
      } 
      const review = JSON.parse(fullText);
      setReview(review)
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
                fontFamily: '"Fira Code", "monospace" ',
                fontSize:50,
                lineHeight: '1.5'
              }}
            />
          </div>

          <button className="review" onClick={reviewCode} disabled={loading}>{loading ? "Reviewing..." : "Review Code"}</button>
        </div>

        <div className="right">
          {
            review && (
              <div className="response">
                <h2>Code Review Results</h2>
                <h4>Summary:</h4>
                <br></br>
                <p>{review.summary}</p>
                <br></br>
                <h4>Score: {review.score}</h4>
                <br></br>
                <h4>Issues Found: {review.issues.length}</h4>
                {review.issues.map((issue,index) => (
                  <div className="issue" key={index}>
                    <h5>Issue: {issue.problem}</h5>
                    <p><strong>Line:</strong> {issue.line}</p>
                    <p><strong>Severity:</strong> {issue.severity}</p>
                    <p><strong>Category:</strong> {issue.category}</p>
                    <p><strong>Suggested Fix:</strong> {issue.fix}</p>
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


