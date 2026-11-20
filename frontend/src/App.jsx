import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import New from './pages/New'
import StudentBalanceManager from './pages/StudentBalanceManager'
import StudentBalanceManagerPay from './pages/StudentBalanceManagerPay'
import StudentBalanceManagerNewCourse from './pages/StudentBalanceManagerNewCourse'

function App()
{
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path='/new' element={<New />} />
				<Route path='/student-balance-manager' element={<StudentBalanceManager />} />
				<Route path='/student-balance-manager/pay' element={<StudentBalanceManagerPay />} />
				<Route path='/student-balance-manager/new-course' element={<StudentBalanceManagerNewCourse />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App