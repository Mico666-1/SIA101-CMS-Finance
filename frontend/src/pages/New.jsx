import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const url = import.meta.env.VITE_API_URL

function New()
{
    const navigate = useNavigate()
    const [studentId, setStudentId] = useState('')
    const [semester, setSemester] = useState('')
    const goHome = () => {navigate('/')}
    const handleSubmit = async (event) =>
    {
        event.preventDefault()
        try
        {
            await fetch(`${url}/api/finance/new-balance`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({studentId, semester})
            })
            goHome()
        }
        catch(err)
        {
            console.log(err)
        }
    }
    return(
        <>
            <h1>New</h1>
            <form onSubmit={handleSubmit}>
                <div><label>Student ID</label><input type='text' value={studentId} onChange={(event) => setStudentId(event.target.value)} required /></div>
                <div><label>Semester</label><input type='number' value={semester} onChange={(event) => setSemester(event.target.value)} required /></div>
                <div>
                    <button>OK</button>
                    <button type='button' onClick={() => {goHome()}}>Cancel</button>
                </div>
            </form>
        </>
    )
}

export default New