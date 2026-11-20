import {useState, useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'

const url = import.meta.env.VITE_API_URL

function StudentBalanceManagerPay()
{
    const navigate = useNavigate()
    const location = useLocation()
    const i = location.state?.record[0]
    const x = location.state?.record[1]
    const [paid, setPaid] = useState('')
    const go2StudentBalanceManager = (i) => {navigate('/student-balance-manager', {state: {record: i}})}
    const [entries, setEntries] = useState([]); useEffect(() => {fetch(`${url}/api/balance/read`).then((res) => res.json()).then(setEntries).catch(console.error)}, [])
    const id = entries[i]?._id
    const handleSubmit = async (event) =>
    {
        event.preventDefault()
        if(!id) return
        try
        {
            await fetch(`${url}/api/finance/course/pay`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id, x, paid})
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
            <h1>Pay for Course</h1>
            <form onSubmit={handleSubmit}>
                <div><label>Amount</label><input type='number' step={0.01} value={paid} onChange={(event) => setPaid(event.target.value)} required /></div>
                <div>
                    <button>OK</button>
                    <button type='button' onClick={() => {go2StudentBalanceManager(i)}}>Cancel</button>
                </div>
            </form>
        </>
    )
}

export default StudentBalanceManagerPay