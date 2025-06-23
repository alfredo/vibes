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

  // Emoji mode state
  let emojiMode = false;
  let hasInitialized = false;

  // Auto-detect emoji mode based on current input
  $: {
    if ($inputText && !hasInitialized) {
      // Check if the current input contains emojis
      const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test($inputText);
      emojiMode = hasEmojis;
      hasInitialized = true;
    }
  }

  // Auto-reload when emoji mode is toggled (but not on initial load)
  let previousEmojiMode = emojiMode;
  $: if (hasInitialized && emojiMode !== previousEmojiMode) {
    vibesActions.loadExample(emojiMode);
    previousEmojiMode = emojiMode;
  }
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

                        <!-- Emoji Mode Toggle -->
      <div style="margin-bottom: 16px;">
        <label class="flex items-center gap-3 text-[#073642] font-medium cursor-pointer" style="padding-bottom: 12px; display: block;">
          <input
            type="checkbox"
            bind:checked={emojiMode}
            class="w-5 h-5 text-[#268bd2] bg-[#fdf6e3] border-[#93a1a1] rounded focus:ring-[#268bd2] focus:ring-2"
          />
          <span class="text-lg">🎭 Emoji Mode</span>
        </label>
      </div>

      <!-- Buttons -->
      <div class="flex flex-wrap gap-4">
        <button
          on:click={vibesActions.toggleInputMinimized}
          class="flex items-center gap-2 px-6 py-3 bg-[#657b83] text-[#fdf6e3] rounded-lg hover:bg-[#586e75] transition-colors font-semibold shadow-lg"
        >
          <Settings size={18} />
          {$isInputMinimized ? 'Show' : 'Hide'} Input
        </button>
        <button
          on:click={() => vibesActions.loadExample(emojiMode)}
          class="flex items-center gap-2 px-6 py-3 bg-[#859900] text-[#fdf6e3] rounded-lg hover:bg-[#b58900] transition-colors font-semibold shadow-lg"
        >
          <RefreshCw size={18} />
          Reload
        </button>
        {#if isValid}
          <button
            on:click={shareVibes}
            class="flex items-center gap-2 px-6 py-3 bg-[#2aa198] text-[#fdf6e3] rounded-lg hover:bg-[#268bd2] transition-colors font-semibold shadow-lg"
          >
            <Share2 size={18} />
            Share
          </button>
          <button
            on:click={downloadPNG}
            class="flex items-center gap-2 px-6 py-3 bg-[#268bd2] text-[#fdf6e3] rounded-lg hover:bg-[#2aa198] transition-colors font-semibold shadow-lg"
          >
            <Download size={18} />
            Download
          </button>
        {/if}
      </div>
    </div>
  </main>

    <!-- Input Drawer - slides up from footer -->
  {#if !$isInputMinimized}
            <div class="fixed left-0 right-0 bg-[#eee8d5] border border-[#93a1a1] rounded-t-lg shadow-2xl z-40 animate-slide-up" style="bottom: 64px;">
      <div class="max-w-4xl mx-auto p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-[#073642]">Enter Your Daily Vibes</h3>
        </div>

        <div class="flex gap-8">
          <div style="width: 300px;">
            <textarea
              bind:value={$inputText}
              class="p-4 border border-[#93a1a1] bg-[#fdf6e3] text-[#073642] rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-[#268bd2] focus:border-[#268bd2]"
              style="width: 100%; box-sizing: border-box;"
              rows="10"
              placeholder="30 Happy&#10;25 Productive&#10;20 Tired&#10;15 Excited&#10;10 Stressed"
            ></textarea>
          </div>

          <div class="pt-4">
            <div class="bg-[#fdf6e3] p-4 rounded-lg border border-[#93a1a1]">
              <div class="space-y-3 text-sm text-[#586e75]">
                <div>• Percentages should add up to 100%</div>
                <div>• Each line: percentage label</div>
              </div>
            </div>
          </div>
        </div>

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
