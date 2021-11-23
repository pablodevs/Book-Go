import React from "react";

export const Calendar = () => {
	return (
		<div className="view">
			<table>
				<thead>
					<tr>
						<td>LUN</td>
						<td>MAR</td>
						<td>MIÉ</td>
						<td>JUE</td>
						<td>VIE</td>
						<td>SÁB</td>
						<td>DOM</td>
					</tr>
				</thead>
				<tbody>
					<tr className="week">
						<td className="day">1</td>
						<td className="day">2</td>
						<td className="day">3</td>
						<td className="day">4</td>
						<td className="day">5</td>
						<td className="day">6</td>
						<td className="day">7</td>
					</tr>
					<tr className="week">
						<td className="day">8</td>
						<td className="day">9</td>
						<td className="day">10</td>
						<td className="day">11</td>
						<td className="day">12</td>
						<td className="day">13</td>
						<td className="day">14</td>
					</tr>
					<tr className="week">
						<td className="day">15</td>
						<td className="day">16</td>
						<td className="day">17</td>
						<td className="day">18</td>
						<td className="day">19</td>
						<td className="day">20</td>
						<td className="day">21</td>
					</tr>
					<tr className="week">
						<td className="day">22</td>
						<td className="day">23</td>
						<td className="day">24</td>
						<td className="day">25</td>
						<td className="day">26</td>
						<td className="day">27</td>
						<td className="day">28</td>
					</tr>
					<tr className="week">
						<td className="day">29</td>
						<td className="day">30</td>
						<td className="day">31</td>
						<td className="day">1</td>
						<td className="day">2</td>
						<td className="day">3</td>
						<td className="day">4</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
