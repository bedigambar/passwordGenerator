import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")                               

  const passwordRef = useRef(null)                                       // This is a reference to the password input element. It will be used to select the password input element when the copy button is clicked. useRef() is used to create a mutable object which holds a .current property that can be changed. It does not cause re-renders when the value changes unlike useState().

  const passwordGenerator = useCallback(() => {                             // This function will generate a random password
    let pass = ""                                                           // String to hold the password
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"       // String to hold the characters for the password
    if (numberAllowed) str += "0123456789"                             // Add numbers to the string if numberAllowed is true
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`"                       // Add special characters to the string if charAllowed is true

    for (let i = 1; i <= length; i++) {                               // This loop will run for the length of the password and generate a random password
      let char = Math.floor(Math.random() * str.length + 1)           // Generate a random number between 1 and the length of the string and add 1 to it. Math.floor() will round the number down to the nearest integer
      pass += str.charAt(char)                                        // Add the character to the password. charAt() is used to get the character at the index of the string
    }

    setPassword(pass)                                                 // Set the password using setPassword use-state for the derived password
  }, [length, numberAllowed, charAllowed, setPassword])               // This is the dependency array. It will run the passwordGenerator function again if any of the values in the array change. setPassword is given here and not password because it will only run if values in setPassword change as values in password constantly keep changing

  const copyPasswordToClipboard = useCallback(() => {                 
    passwordRef.current?.select();                                    // Select the password input element
    passwordRef.current?.setSelectionRange(0, 999);                   // Set the selection range of the password input element to 0 to 999. This will select the entire password
    window.navigator.clipboard.writeText(password)                    // Copy the password to the clipboard using the Clipboard API
  }, [password])

  useEffect(() => { passwordGenerator() }, [length, numberAllowed, charAllowed, passwordGenerator])        // This useEffect will run the passwordGenerator function when the component mounts and when the length, numberAllowed, or charAllowed state changes

  return (
    <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-purple-950 text-gray-200">
      <h1 className='text-amber-300 text-center my-3'>Password Generator</h1>
      <div className="flex shadow rounded-lg overflow-hidden mb-4">
        <input
          type="text"
          value={password}
          className="outline-none w-full py-1 px-3"
          placeholder="Password"
          readOnly
          ref={passwordRef}
        />
        <button
          onClick={copyPasswordToClipboard}
          className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 animated hover:bg-blue-600 transition-all duration-200'
        >Copy</button>

      </div>
      <div className='flex text-sm gap-x-2'>
        <div className='flex items-center gap-x-1'>
          <input
            type="range"                                    // Range input to select the length of the password
            min={6}                                         // Minimum length of the password
            max={100}                                     // Maximum length of the password                         
            value={length}                               // Set the value of the range input to the length of the password
            className='cursor-pointer'
            onChange={(e) => { setLength(e.target.value) }}           // This onChange event will run when the range input is changed. It will set the length state to the value of the range input
          />
          <label>Length: {length}</label>                      
           {/* // Label is used to show the length of the password in the range input  */}
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            defaultChecked={numberAllowed}
            id="numberInput"
            onChange={() => {
              setNumberAllowed((prev) => !prev);                // This onChange event will run when the checkbox is checked or unchecked. It will set the numberAllowed state to true or false depending on what the prev was
            }}
          />
          <label htmlFor="numberInput">Numbers</label>           
          {/* // htmlFor is used to link the label to the input element. This will make the label clickable and check or uncheck the checkbox */}
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            defaultChecked={charAllowed}
            id="characterInput"
            onChange={() => {
              setCharAllowed((prev) => !prev)
            }}
          />
          <label htmlFor="characterInput">Characters</label>
        </div>
      </div>
    </div>
  )
}

export default App