import useAdminGuard from '../../../hooks/use-isAdmin'
import './Reports.css'
import useTitle from '../../../hooks/use-title';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";


export default function Admin() {

    useAdminGuard();
    useTitle('Admin reports panel');
    const vacations = useSelector((state: RootState) => state.vacations.vacations);

    const data = vacations.map(v => ({
        destination: v.destination,
        followers: v.followers?.length || 0,
    }));

    const exportCSV = () => {
        const header = "Destination,Followers\n";
        const rows = data.map(d => `${d.destination},${d.followers}`).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
        saveAs(blob, "vacation_report.csv");
    };

    return (
        <div className="vacation-report-container">
            <h2>Vacation Followers Report</h2>
            <button className="export-btn" onClick={exportCSV}>Export CSV</button>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="destination" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="followers" fill="#4e79a7" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
