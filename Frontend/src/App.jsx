import {useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import prism from "prismjs"
import editor from "react-simple-code-editor"
import axios from "axios"
import Markdown from "react-markdown"
import './App.css'

const Editor = editor.default


function App() {
  const [count, setCount] = useState(0)
  const [review, setReview] =useState("")
  const [code, setCode] = useState( `function sum(){
  return 1+1
}` )
  

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode(){
    const response= await axios.post('http://localhost:3000/ai/get-review', {code})
    console.log(review)
    setReview(response.data.review)
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
                fontSize: 50,
                lineHeight: '1.5'
              }}
            />
          </div>

          <div className="review" onClick={reviewCode}>Review</div>
        </div>

        <div className="right">
          <Markdown>{review}</Markdown>
        </div>
      </main>
    </>
  )
}

export default App


