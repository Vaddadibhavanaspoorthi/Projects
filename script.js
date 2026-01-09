let employeeData = {};

      document
        .getElementById("fileUpload")
        .addEventListener("change", function (event) {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(
              workbook.Sheets[sheetName]
            );

            worksheet.forEach((row) => {
              employeeData[row["Employee ID"]] = row;
            });
            alert("File successfully uploaded and processed!");
          };
          reader.readAsArrayBuffer(file);
        });

      function formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-GB");
      }

      function generatePayslip() {
        const employeeId = document.getElementById("employeeId").value;
        const employee = employeeData[employeeId];

        if (employee) {
          const payslipHTML = `
            <div class="container" id="payslip">
              <div class="header">
                <h1>SYMBIOSYS TECHNOLOGIES</h1>
                <h2>
                  Plot No 1 & 2, Hill no-2, IT Park,<br />
                  Rushikonda, Visakhapatnam-45<br />
                  Ph: 2550369, 2596567
                </h2>
                <h3>SALARY STATEMENT FOR THE MONTH OF MAY 2024</h3>
              </div>
              <table class="details">
                <tr>
                  <th>Employee Code</th>
                  <td>${employee["Employee ID"] || ""}</td>
                  <th>Date of Joining</th>
                  <td>${formatDate(employee["Date of Joining"])}</td>
                </tr>
                <tr>
                  <th>Employee Name</th>
                  <td>${employee["Employee Name"] || ""}</td>
                  <th>Employment Status</th>
                  <td>${employee["Employment status"] || ""}</td>
                </tr>
                <tr>
                  <th>Designation</th>
                  <td>${employee["Designation"] || ""}</td>
                  <th>Statement for the month</th>
                  <td>${employee["Statement for the month"] || ""}</td>
                </tr>
              </table>
              <table class="salary-table">
                <tr>
                  <th>Classified Income</th>
                  <th>Amount (Rs.)</th>
                  <th>Deductions</th>
                  <th>Amount (Rs.)</th>
                </tr>
                <tr>
                  <td>Basic Pay</td>
                  <td>${employee["Basic Pay"] || "0.00"}</td>
                  <td>Professional Tax</td>
                  <td>${employee["Professional Tax"] || "0.00"}</td>
                </tr>
                <tr>
                  <td>House Rent Allowance</td>
                  <td>${employee["House Rent Allowance"] || "0.00"}</td>
                  <td>Income Tax</td>
                  <td>${employee["Income Tax"] || "0.00"}</td>
                </tr>
                <tr>
                  <td>City Compensatory Allowance</td>
                  <td>${employee["City Compensatory Allowance"] || "0.00"}</td>
                  <td>Provident Fund</td>
                  <td>${employee["Provident Fund"] || "0.00"}</td>
                </tr>
                <tr>
                  <td>Travel Allowance</td>
                  <td>${employee["Travel Allowance"] || "0.00"}</td>
                  <td>ESI</td>
                  <td>${employee["ESI"] || "0.00"}</td>
                </tr>
                <tr>
                  <td>Food Allowance</td>
                  <td>${employee["Food Allowance"] || "0.00"}</td>
                  <td>Leaves - Loss of Pay</td>
                  <td>${employee["Leaves - Loss of Pay"] || "0.00"}</td>
                </tr>
                <tr>
                  <td>Performance Incentives</td>
                  <td>${employee["Performance Incentives"] || "0.00"}</td>
                  <td>Others</td>
                  <td>${employee["Others"] || "0.00"}</td>
                </tr>
              </table>
              <table class="salary-table">
                <tr>
                  <th>Gross Pay</th>
                  <td>${employee["GROSS PAY"] || "0.00"}</td>
                  <th>Deductions</th>
                  <td>${employee["DEDUCTIONS"] || "0.00"}</td>
                  <th>Net Pay</th>
                  <td>${employee["NET PAY"] || "0.00"}</td>
                </tr>
              </table>
              <div class="authorized-signatory">
                <p>AUTHORIZED SIGNATORY</p>
                <p>Sudheer<br />H.R Executive</p>
              </div>
              <div class="contact">
                <p>
                  We request you to verify employment details with our office on
                  email: hr@symbiosystech.com. (+91-0891-2550369)
                </p>
              </div>
              <button class="button" onclick="printPayslip()">Print</button>
              <button class="button" onclick="downloadPayslip()">Download</button>
            </div>
          `;
          document.getElementById("payslipContainer").innerHTML = payslipHTML;
        } else {
          alert("Employee ID not found!");
        }
      }

      function printPayslip() {
        const payslip = document.getElementById("payslip").innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = payslip;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
      }

      function downloadPayslip() {
        const element = document.createElement("a");
        const payslip = document.getElementById("payslip").innerHTML;
        const blob = new Blob([payslip], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        element.href = url;
        element.download = "payslip.html";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }