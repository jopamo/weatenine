const getChartOptions = (experimentSettings) => ({
    scales: {
      x: {
        grid: {
          color: "rgba(255,255,255,0.8)", // Color of the grid lines for the x-axis
        },
        title: {
          display: true, // Enable display of the x-axis title
          text: `Independent Variable: ${experimentSettings.independentVar}`, // Text for the x-axis title
          color: "white", // Color of the x-axis title text
        },
      },
      y: {
        grid: {
          color: "rgba(255,255,255,0.9)", // Color of the grid lines for the y-axis
        },
        title: {
          display: true, // Enable display of the y-axis title
          text: "Number of Paint Drops", // Text for the y-axis title
          color: "white", // Color of the y-axis title text
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3, // Width of the line elements in the chart
      },
      point: {
        radius: 5, // Radius of the point elements in the chart
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Background color of the points
        borderColor: "rgba(255, 255, 255, 1)", // Border color of the points
      },
    },
    maintainAspectRatio: false, // Determines if the chart should maintain aspect ratio
    responsive: true, // Makes the chart responsive to window resizing
    layout: {
      padding: {
        top: 20, // Top padding of the chart layout
        bottom: 50, // Bottom padding of the chart layout
        left: 20, // Left padding of the chart layout
        right: 20, // Right padding of the chart layout
      },
    },
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Background color for the entire chart
    plugins: {
      title: {
        display: true, // Enable display of the chart title
        text: "", // Text for the chart title
        color: "white", // Color of the chart title text
      },
    },
});

export default getChartOptions;
