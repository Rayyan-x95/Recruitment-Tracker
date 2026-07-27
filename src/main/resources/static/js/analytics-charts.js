// Analytics Chart.js Initialization

document.addEventListener("DOMContentLoaded", function () {
    const funnelChartCtx = document.getElementById("candidateFunnelChart");
    const offerChartCtx = document.getElementById("offerDistributionChart");
    const roundChartCtx = document.getElementById("interviewRoundsChart");

    if (!funnelChartCtx && !offerChartCtx && !roundChartCtx) {
        return;
    }

    fetch("/api/analytics")
        .then(response => response.json())
        .then(data => {
            // 1. Candidate Pipeline Funnel Chart
            if (funnelChartCtx) {
                const statusMap = data.candidatesByStatus || {};
                new Chart(funnelChartCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'],
                        datasets: [{
                            label: 'Candidates Count',
                            data: [
                                statusMap['APPLIED'] || 0,
                                statusMap['SCREENING'] || 0,
                                statusMap['INTERVIEWING'] || 0,
                                statusMap['OFFERED'] || 0,
                                statusMap['HIRED'] || 0,
                                statusMap['REJECTED'] || 0
                            ],
                            backgroundColor: [
                                '#38bdf8', '#fbbf24', '#6366f1', '#c084fc', '#4ade80', '#f87171'
                            ],
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { beginAtZero: true, ticks: { precision: 0 } }
                        }
                    }
                });
            }

            // 2. Offer Status Distribution Chart
            if (offerChartCtx) {
                const offerMap = data.offersByStatus || {};
                new Chart(offerChartCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Pending', 'Accepted', 'Rejected', 'Expired'],
                        datasets: [{
                            data: [
                                offerMap['PENDING'] || 0,
                                offerMap['ACCEPTED'] || 0,
                                offerMap['REJECTED'] || 0,
                                offerMap['EXPIRED'] || 0
                            ],
                            backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#9ca3af']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom' }
                        }
                    }
                });
            }

            // 3. Interview Rounds Breakdown
            if (roundChartCtx) {
                const roundMap = data.interviewsByRound || {};
                const labels = Object.keys(roundMap);
                const values = Object.values(roundMap);

                new Chart(roundChartCtx, {
                    type: 'polarArea',
                    data: {
                        labels: labels.length > 0 ? labels : ['HR', 'Tech 1', 'Tech 2', 'Managerial'],
                        datasets: [{
                            data: values.length > 0 ? values : [0, 0, 0, 0],
                            backgroundColor: ['#818cf8', '#34d399', '#fbbf24', '#f472b6']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom' }
                        }
                    }
                });
            }
        })
        .catch(err => console.error("Error loading analytics data:", err));
});
