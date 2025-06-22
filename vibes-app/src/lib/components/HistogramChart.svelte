<script lang="ts">
  import { vibesData, getVibeColor, isInputMinimized, vibesActions, inputText, showErrors } from '../stores/vibesStore.js';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { Download, Settings } from 'lucide-svelte';

  $: entries = $vibesData.entries;
  $: isValid = $vibesData.isValid && entries.length > 0;
  $: hasEntries = entries.length > 0;

  let chartContainer: HTMLDivElement;
  let svgElement: SVGElement;
  let mounted = false;

  onMount(() => {
    mounted = true;
    // Always try to draw chart when mounted, even if empty
    drawChart();
  });

  // Update chart whenever vibesData changes
  $: if (mounted && $vibesData) {
    drawChart();
  }

  function drawChart() {
    if (!chartContainer) return;

    // Clear previous chart
    d3.select(chartContainer).selectAll("*").remove();

    // If no entries at all, don't draw anything (let the empty state show)
    if (!hasEntries) return;

    const margin = { top: 30, right: 160, bottom: 30, left: 20 };
    const width = 600;
    const height = 500;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(chartContainer)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "#fdf6e3")
      .style("display", "block");

    // Store reference to SVG element for download
    svgElement = svg.node() as SVGElement;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate cumulative heights for stacking
    let cumulative = 0;
    const stackedData = entries.map((entry, i) => {
      const startY = cumulative;
      cumulative += entry.percentage;
      return {
        ...entry,
        startY,
        endY: cumulative,
        height: entry.percentage,
        color: getVibeColor(entry.label, i)
      };
    });

    // Create scale for the bar
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([chartHeight, 0]);

    // Draw the stacked segments
    const segments = g.selectAll(".segment")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", "segment");

    // Add rectangles with animation
    segments.append("rect")
      .attr("x", 0)
      .attr("width", 100)
      .attr("y", d => yScale(d.endY))
      .attr("height", 0)
      .attr("fill", d => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("rx", 4)
      .transition()
      .duration(800)
      .delay((d, i) => i * 150)
      .attr("height", d => yScale(100 - d.height) - yScale(100));

    // Add percentage labels inside bars
    segments.append("text")
      .attr("x", 50)
      .attr("y", d => yScale(d.startY + d.height / 2))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "16px")
      .attr("font-family", "Neuton, serif")
      .attr("opacity", 0)
      .text(d => `${d.percentage}%`)
      .transition()
      .duration(600)
      .delay((d, i) => i * 150 + 400)
      .attr("opacity", 1);

    // Add external labels with lines (like the lemonade chart)
    const labelGroup = segments.append("g")
      .attr("class", "label-group");

    // Add connecting lines
    labelGroup.append("line")
      .attr("x1", 100)
      .attr("y1", d => yScale(d.startY + d.height / 2))
      .attr("x2", 100)
      .attr("y2", d => yScale(d.startY + d.height / 2))
      .attr("stroke", "#666")
      .attr("stroke-width", 1)
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 150 + 600)
      .attr("x2", 130)
      .attr("opacity", 1);

    // Add horizontal line to label
    labelGroup.append("line")
      .attr("x1", 130)
      .attr("y1", d => yScale(d.startY + d.height / 2))
      .attr("x2", 130)
      .attr("y2", d => yScale(d.startY + d.height / 2))
      .attr("stroke", "#666")
      .attr("stroke-width", 1)
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 150 + 700)
      .attr("x2", 170)
      .attr("opacity", 1);

    // Add external labels
    labelGroup.append("text")
      .attr("x", 180)
      .attr("y", d => yScale(d.startY + d.height / 2))
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .attr("font-family", "Neuton, serif")
      .attr("fill", "#073642")
      .attr("opacity", 0)
      .text(d => d.label)
      .transition()
      .duration(400)
      .delay((d, i) => i * 150 + 800)
      .attr("opacity", 1);

    // Add color indicator circles next to labels
    labelGroup.append("circle")
      .attr("cx", 170)
      .attr("cy", d => yScale(d.startY + d.height / 2))
      .attr("r", 0)
      .attr("fill", d => d.color)
      .transition()
      .duration(300)
      .delay((d, i) => i * 150 + 900)
            .attr("r", 6);

    // Add title aligned to left above the chart
    svg.append("text")
      .attr("x", margin.left)
      .attr("y", 25)
      .attr("text-anchor", "start")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("font-family", "Neuton, serif")
      .attr("fill", "#073642")
      .text("Today's vibes");

    // Add total indicator at bottom
    if ($vibesData.totalPercentage < 100) {
      const remaining = 100 - $vibesData.totalPercentage;

      // Add remaining space rectangle
      g.append("rect")
        .attr("x", 0)
        .attr("width", 100)
        .attr("y", yScale(remaining))
        .attr("height", yScale(100) - yScale(remaining))
        .attr("fill", "#f3f4f6")
        .attr("stroke", "#d1d5db")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("rx", 4);

      // Add remaining label
      g.append("text")
        .attr("x", 180)
        .attr("y", yScale(remaining / 2))
        .attr("dominant-baseline", "middle")
        .attr("font-size", "14px")
        .attr("font-style", "italic")
        .attr("font-family", "Neuton, serif")
        .attr("fill", "#666")
        .text(`${remaining.toFixed(1)}% Unaccounted`);
    }
  }



  function downloadPNG() {
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Get SVG dimensions
    const svgRect = svgElement.getBoundingClientRect();
    canvas.width = svgRect.width * 2; // Higher resolution
    canvas.height = svgRect.height * 2;

    img.onload = function() {
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(function(blob) {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `vibes-chart-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      });
    };

    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  }
</script>



<!-- Chart container -->
<div bind:this={chartContainer} class="w-full">
  {#if !hasEntries}
    <div class="text-center py-20 text-[#657b83]">
      <p class="text-2xl font-semibold mb-3">Ready to visualize your vibes?</p>
      <p class="text-lg">Click "Show Input" below to enter your daily vibes</p>
      <div class="mt-6 text-sm text-[#93a1a1] max-w-md mx-auto">
        <p class="mt-2">Format: <code class="bg-[#fdf6e3] px-2 py-1 rounded border border-[#d3af86]">30 Happy</code></p>
      </div>
    </div>
  {/if}
</div>
