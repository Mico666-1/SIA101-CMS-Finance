import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import '../App.css'

const url = import.meta.env.VITE_API_URL

function Home()
{
    const navigate = useNavigate()
    const createNewEntry = () => {navigate('/new')}
    const go2StudentBalanceManager = (i) => {navigate('/student-balance-manager', {state: {record: i}})}
    const [entries, setEntries] = useState([]); useEffect(() => {fetch(`${url}/api/balance/read`).then((res) => res.json()).then(setEntries).catch(console.error)}, [])
    return(
        <>
            <h1>College Management System - Finance</h1>
            <table border="1" cellpadding="8">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Semester</th>
                        <th>School Year</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        entries.length > 0 ?
                        (
                            entries.map((entry, i) =>
                            (
                                <tr key={entry._id}>
                                    <td>{entry.studentId}</td>
                                    <td>{entry.semester}</td>
                                    <td>{entry.schoolYear}</td>
                                    <td><button onClick={() => go2StudentBalanceManager(i)}>Manage</button></td>
                                </tr>
                            ))
                        )
                        :
                        (
                            <tr><td colSpan={5}>Empty</td></tr>
                        )
                    }
                </tbody>
            </table>
            <div>
                <button onClick={() => createNewEntry()}>New</button>
            </div>
        </>
    )
}

export default Home