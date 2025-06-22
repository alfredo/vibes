<script lang="ts">
  import HistogramChart from '$lib/components/HistogramChart.svelte';
  import { vibesData, isInputMinimized, vibesActions, inputText, showErrors } from '$lib/stores/vibesStore.js';
  import { Download, Settings, Share2, RefreshCw } from 'lucide-svelte';

  // Download function (moved from component)
  function downloadPNG() {
    const svgElement = document.querySelector('svg');
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

  // Share function
  let shareMessage = '';
  let showShareMessage = false;

  async function shareVibes() {
    const success = await vibesActions.shareVibes($inputText);
    if (success) {
      shareMessage = 'Link copied to clipboard!';
      showShareMessage = true;
      setTimeout(() => {
        showShareMessage = false;
      }, 3000);
    } else {
      shareMessage = 'Failed to copy link';
      showShareMessage = true;
      setTimeout(() => {
        showShareMessage = false;
      }, 3000);
    }
  }

  $: isValid = $vibesData.isValid && $vibesData.entries.length > 0;
</script>

<svelte:head>
  <title>What's today's vibes?</title>
  <meta name="description" content="What's today's vibes?" />
</svelte:head>

<div class="min-h-screen flex flex-col bg-[#fdf6e3]">
    <!-- Main Content -->
  <main class="bg-[#fdf6e3] min-h-screen p-8">
    <div class="w-full max-w-4xl">
      <!-- Title -->
      <div class="mb-12">
        <h1 class="text-5xl font-bold text-[#073642] mb-4">What's today's vibes?</h1>
      </div>

      <!-- Chart -->
      <div class="mb-12">
        <HistogramChart />
      </div>

      <!-- Buttons -->
      <div class="flex flex-wrap gap-4">
        {#if isValid}
          <button
            on:click={downloadPNG}
            class="flex items-center gap-2 px-6 py-3 bg-[#268bd2] text-[#fdf6e3] rounded-lg hover:bg-[#2aa198] transition-colors font-semibold shadow-lg"
          >
            <Download size={18} />
            Download
          </button>
          <button
            on:click={shareVibes}
            class="flex items-center gap-2 px-6 py-3 bg-[#2aa198] text-[#fdf6e3] rounded-lg hover:bg-[#268bd2] transition-colors font-semibold shadow-lg"
          >
            <Share2 size={18} />
            Share
          </button>
        {/if}
        <button
          on:click={vibesActions.loadExample}
          class="flex items-center gap-2 px-6 py-3 bg-[#859900] text-[#fdf6e3] rounded-lg hover:bg-[#b58900] transition-colors font-semibold shadow-lg"
        >
          <RefreshCw size={18} />
          Reload
        </button>
        <button
          on:click={vibesActions.toggleInputMinimized}
          class="flex items-center gap-2 px-6 py-3 bg-[#657b83] text-[#fdf6e3] rounded-lg hover:bg-[#586e75] transition-colors font-semibold shadow-lg"
        >
          <Settings size={18} />
          {$isInputMinimized ? 'Show' : 'Hide'} Input
        </button>
      </div>
    </div>
  </main>

    <!-- Input Drawer - slides up from footer -->
  {#if !$isInputMinimized}
            <div class="fixed left-0 right-0 bg-[#eee8d5] border border-[#93a1a1] rounded-t-lg shadow-2xl z-40 animate-slide-up" style="bottom: 64px;">
      <div class="max-w-md mx-auto p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-[#073642]">Enter Your Daily Vibes</h3>
          <button
            on:click={vibesActions.toggleInputMinimized}
            class="text-[#586e75] hover:text-[#073642] text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div class="mb-4 p-3 bg-[#fdf6e3] border border-[#93a1a1] rounded-lg text-sm">
          <p class="font-medium text-[#073642] mb-2">Format:</p>
          <ul class="text-[#586e75] space-y-1 text-xs">
            <li>• Each line: <code class="bg-[#eee8d5] px-1 rounded">percentage label</code></li>
            <li>• Example: <code class="bg-[#eee8d5] px-1 rounded">30 Happy</code></li>
            <li>• Percentages should add up to 100%</li>
          </ul>
        </div>

        <textarea
          bind:value={$inputText}
          class="w-full p-3 border border-[#93a1a1] bg-[#fdf6e3] text-[#073642] rounded-lg resize-none min-h-[120px] font-mono text-sm focus:ring-2 focus:ring-[#268bd2] focus:border-[#268bd2]"
          placeholder="30 Happy&#10;25 Productive&#10;20 Tired&#10;15 Excited&#10;10 Stressed"
        ></textarea>

        {#if $showErrors && $vibesData.errors.length > 0}
          <div class="mt-4 p-3 bg-[#fdf6e3] border border-[#dc322f] rounded-lg text-sm">
            <p class="font-medium text-[#dc322f] mb-2">Please fix these issues:</p>
            <ul class="text-[#dc322f] space-y-1 text-xs">
              {#each $vibesData.errors as error}
                <li>• {error}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Share notification -->
  {#if showShareMessage}
    <div class="fixed top-4 right-4 bg-[#2aa198] text-[#fdf6e3] px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in">
      {shareMessage}
    </div>
  {/if}
</div>
