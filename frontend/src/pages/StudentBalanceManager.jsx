import {useState, useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import '../App.css'

function StudentBalanceManager()
{
    const navigate = useNavigate()
    const location = useLocation()
    const i = location.state?.record
    const goHome = () => {navigate('/')}
    const go2Pay = (x) => {navigate('/student-balance-manager/pay', {state: {record: [i, x]}})}
    const go2NewCourse = (i) => {navigate('/student-balance-manager/new-course', {state: {record: i}})}
    const [entries, setEntries] = useState([]); useEffect(() => {fetch('http://localhost:5000/api/balance/read').then((res) => res.json()).then(setEntries).catch(console.error)}, [])
    const entry = entries[i]
    if(!entry){return <><p>Information to be shown here doesn't exist.</p><div><button onClick={() => goHome()}>Close</button></div></>}
    return(
        <>
            <h1>Student Balance Manager</h1>
            <table border="1" cellpadding="8">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Amount</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        entry.courses.length > 0 ?
                        (
                            entry.courses.map((course, x) =>
                                <tr>
                                    <td>{course.course}</td>
                                    <td>{course.amount}</td>
                                    <td>{course.paid}</td>
                                    <td>{course.amount - course.paid}</td>
                                    <td><button onClick={() => go2Pay(x)}>Pay</button></td>
                                </tr>
                            )
                        )
                        :
                        (
                            <tr>
                                <td colSpan="5">No courses</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <div>
                <button onClick={() => go2NewCourse(i)}>New Course</button>
                <button onClick={() => goHome()}>Close</button>
            </div>
        </>
    )
}

export default StudentBalanceManager