import {useState, useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'

const url = import.meta.env.VITE_API_URL

function StudentBalanceManagerNewCourse()
{
    const navigate = useNavigate()
    const location = useLocation()
    const i = location.state?.record
    const [course, setCourse] = useState('')
    const [amount, setAmount] = useState('')
    const go2StudentBalanceManager = (i) => {navigate('/student-balance-manager', {state: {record: i}})}
    const [entries, setEntries] = useState([]); useEffect(() => {fetch(`${url}/api/balance/read`).then((res) => res.json()).then(setEntries).catch(console.error)}, [])
    const id = entries[i]?._id
    const handleSubmit = async (event) =>
    {
        event.preventDefault()
        if(!id) return
        try
        {
            await fetch(`${url}/api/finance/add-course`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id, course, amount: Number(amount)})
            })
            go2StudentBalanceManager(i)
        }
        catch(err)
        {
            console.log(err)
        }
    }
    return(
        <>
            <h1>New Course</h1>
            <form onSubmit={handleSubmit}>
                <div><label>Course</label><input type='text' value={course} onChange={(event) => setCourse(event.target.value)} required /></div>
                <div><label>Amount</label><input type='number' step={0.01} value={amount} onChange={(event) => setAmount(event.target.value)} required /></div>
                <div>
                    <button>OK</button>
                    <button type='button' onClick={() => {go2StudentBalanceManager(i)}}>Cancel</button>
                </div>
            </form>
        </>
    )
}

export default StudentBalanceManagerNewCourse