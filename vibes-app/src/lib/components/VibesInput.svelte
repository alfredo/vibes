<script lang="ts">
  import { inputText, vibesData, showErrors, isInputFocused, isInputMinimized, vibesActions } from '../stores/vibesStore.js';
  import { RefreshCw, HelpCircle } from 'lucide-svelte';

  let textareaElement: HTMLTextAreaElement;
  let showHelp = false;

  function handleFocus() {
    vibesActions.setInputFocus(true);
  }

  function handleBlur() {
    vibesActions.setInputFocus(false);
  }

  function handleKeydown(event: KeyboardEvent) {
    // Auto-resize textarea
    setTimeout(() => {
      textareaElement.style.height = 'auto';
      textareaElement.style.height = textareaElement.scrollHeight + 'px';
    }, 0);
  }

  function loadExample() {
    vibesActions.loadExample();
    textareaElement.focus();
  }

  function clearInput() {
    vibesActions.clearInput();
    textareaElement.focus();
  }
</script>

<div class="vibe-card">
  <div class="flex items-center justify-between mb-4">

    <button
      type="button"
      on:click={() => showHelp = !showHelp}
      class="p-2 text-gray-500 hover:text-gray-700 transition-colors"
      aria-label="Toggle help"
    >
      <HelpCircle size={20} />
    </button>
  </div>

  {#if showHelp && !$isInputMinimized}
    <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
      <p class="font-medium text-blue-800 mb-2">How to format your input:</p>
      <ul class="text-blue-700 space-y-1">
        <li>• Each line: percentage label</li>
        <li>• Percentages should add up to 100%</li>
        <li>• Maximum 10 entries allowed</li>
      </ul>
    </div>
  {/if}

  {#if !$isInputMinimized}
    <div class="space-y-4">
      <div class="relative">
        <textarea
          bind:this={textareaElement}
          bind:value={$inputText}
          on:focus={handleFocus}
          on:blur={handleBlur}
          on:keydown={handleKeydown}
          class="vibe-input resize-none min-h-[120px] font-mono text-sm"
          placeholder="30 Happy&#10;25 Productive&#10;20 Tired&#10;15 Excited&#10;10 Stressed"
          aria-label="Vibes input"
        ></textarea>

        {#if $inputText.trim() === ''}
          <div class="absolute top-4 right-4">
            <button
              type="button"
              on:click={loadExample}
              class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Load Example
            </button>
          </div>
        {/if}
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          on:click={loadExample}
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <RefreshCw size={16} />
          New Example
        </button>

        <button
          type="button"
          on:click={clearInput}
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
        >
          Clear
        </button>
      </div>

      {#if $showErrors && $vibesData.errors.length > 0}
        <div class="error-message">
          <p class="font-medium mb-2">Please fix these issues:</p>
          <ul class="space-y-1">
            {#each $vibesData.errors as error}
              <li>• {error}</li>
            {/each}
          </ul>
        </div>
      {:else if $vibesData.isValid && $vibesData.entries.length > 0}
        <div class="success-message">
          ✓ Valid input! Total: {$vibesData.totalPercentage.toFixed(1)}%
        </div>
      {/if}
    </div>
  {:else}
    <!-- Minimized state - show current data summary -->
    <div class="text-center py-4 text-gray-600">
      <p class="text-sm">
        {#if $vibesData.isValid && $vibesData.entries.length > 0}
          <span class="font-medium">{$vibesData.entries.length} vibes</span> •
          <span class="font-medium">{$vibesData.totalPercentage.toFixed(1)}% total</span>
        {:else}
          Click the input toggle to expand
        {/if}
      </p>
    </div>
  {/if}
</div>
