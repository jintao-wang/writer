import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";

const ContainerSC = styled('div')`
  width: 100vw;  
`

const ContentSC = styled('div')`
  width: 80vw;
  min-height: 100vh;
  margin-left: auto;
  margin-right: auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 12px;
  margin-top: 10vh;
  padding: 10px 50px;
  color: #333333;
  
  span {
    outline: none;
  }
`

const H1SC = styled('h1')`
  
`
const H2SC = styled('h2')`
  
`
const H3SC = styled('h3')`
  
`
const H4SC = styled('h4')`
  
`
const H5SC = styled('h5')`
  
`
const H6SC = styled('h6')`
  
`
const PSC = styled('p')`
  
`

const TypeMap = new Map()
TypeMap.set('h1', H1SC)
TypeMap.set('h2', H2SC)
TypeMap.set('h3', H3SC)
TypeMap.set('h4', H4SC)
TypeMap.set('h5', H5SC)
TypeMap.set('h6', H6SC)
TypeMap.set('p', PSC)

const App = () => {
    const [lineList, setLineList] = useState(() => {
        if(localStorage.lineList && localStorage.lineList.length > 0) return JSON.parse(localStorage.lineList)
        return (
            [
                {
                    type: 'h1',
                    content: '开始编写你的文档'
                }
            ]
        )
    })
    const [activeLine, setActiveLine] = useState(null)
    const lineListRef = useRef([]);
    const markdownCheck = []

    const changeType = ( target, e) => {
        if( lineList[+activeLine].type === target) {
            changeType('p', e)
            return
        }
        lineList[+activeLine].type = target
        const newLineList = [...lineList]
        setLineList(newLineList)
        setTimeout(() => {
            lineListRef.current[activeLine].focus()
            const range = document.createRange();
            range.selectNodeContents( lineListRef.current[activeLine]);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        })
    }

    const keyDown = (e) => {
        const keyCode = e.keyCode || e.which || e.charCode;
        const ctrlKey = e.ctrlKey
        const metaKey = e.metaKey
        const shiftKey = e.shiftKey
        if (keyCode === 13) {
            markdownCheck.length = 0
            e.preventDefault()
            const newLine = {
                type: 'p',
                content: '&nbsp'
            }
            lineList.splice(activeLine + 1, 0, newLine)
            const newLineList = [...lineList]
            setLineList(newLineList)
            lineListRef.current[activeLine].blur()
            setTimeout(() => {
                lineListRef.current[activeLine + 1].focus();
                setActiveLine(activeLine + 1)
            })

            // e.target.blur()
            // const newDom = e.currentTarget
            // setTimeout(() => {
            //     setActiveLine(activeLine + 1)
            //     newDom.childNodes[activeLine + 1].lastChild.focus();
            // })
            return

        }
        if (keyCode === 49 && ctrlKey) {
            changeType('h1', e);
            return;
        }
        if (keyCode === 50 && ctrlKey) {
            changeType('h2', e);
            return;
        }
        if (keyCode === 51 && ctrlKey) {
            changeType('h3', e);
            return;
        }
        if (keyCode === 52 && ctrlKey) {
            changeType('h4', e);
            return;
        }
        if (keyCode === 53 && ctrlKey) {
            changeType('h5', e);
            return;
        }
        if (keyCode === 54 && ctrlKey) {
            changeType('h6', e);
            return;
        }
        if(e.key === '#' ) {
            markdownCheck.push(e.key)
        }
        if(markdownCheck.length !== 0) {
            if(e.keyCode === 32) {
                if(markdownCheck[0] === '#') {
                    lineList[activeLine].type = 'h' + markdownCheck.length
                    lineList[activeLine].content = lineList[activeLine].content.slice(markdownCheck.length)
                    markdownCheck.length = 0
                    const newLineList = [...lineList]
                    setLineList(newLineList)
                    setTimeout(() => {
                        lineListRef.current[activeLine].focus();
                    })
                }
            }
        }

    }

    const onChange = (index,e) => {
        setActiveLine(index)
        const content = e.target.innerHTML.trim()
        lineList[index].content = content
        localStorage.lineList = JSON.stringify(lineList)
    }

    const onClick = (index) => {
        setActiveLine(index)
    }

    const endChange = () => {
        const newLineList = [...lineList]
        setLineList(newLineList)
    }

    return (
      <ContainerSC>
          <ContentSC onKeyDown={e => keyDown(e)}>
              {
                 lineList.map((item,index) => {
                      const TypeSC = TypeMap.get(item.type)
                      return (
                          <TypeSC key={index} onClick={() => onClick(index)}>
                              <span contentEditable={true}  suppressContentEditableWarning={true}
                                    ref={e => lineListRef.current[index] = e}
                                    onInput={e => onChange(index,e)} onBlur={() => endChange()}  dangerouslySetInnerHTML={{ __html: item.content}} >
                              </span>
                          </TypeSC>
                      )
                  })
              }

          </ContentSC>
      </ContainerSC>
    );
}

export default App;
