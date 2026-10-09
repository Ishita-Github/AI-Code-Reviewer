import {useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import prism from "prismjs"
import editor from "react-simple-code-editor"
import axios from "axios"
import Markdown from "react-markdown"
import './App.css'

const Editor = editor.default


function App() {
  const [review, setReview] =useState("")
  const [loading,setLoading] =useState(false)
  const [code, setCode] = useState( `function sum(){
  return 1+1
}` )
  

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode(){
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/ai/get-review',
        { code }
      )

      console.log("Full response:", response)
      console.log("Response data:", response.data.review)

      setReview(response.data.review)
    } catch (error) {
      console.log("Error:", error)
      if (error.response?.status === 429) {
        setReview("Too many requests. Please try again later.")}
      else {
        setReview("Something went wrong. Please try again.")}
      }finally{
        setLoading(false);
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code =>
                prism.highlight(
                  code,
                  prism.languages.javascript,
                  "javascript"
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
          <Markdown>{review}</Markdown>
        </div>
      </main>
    </>
  )
}

export default App


