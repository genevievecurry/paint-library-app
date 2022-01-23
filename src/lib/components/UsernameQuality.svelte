<script lang="ts">
  import {
    circleCheckmarkIcon,
    circleErrorIcon,
    emptyCircleIcon,
  } from '$lib/icons';

  export let validation;
  export let username;
</script>

<div>
  <span class="block font-bold">Username Guidelines</span>
  <small class="leading-5 block mt-1 text-sm text-gray-500 mb-1"
    >This is what other users will see.</small>
  <table class="table-auto">
    {#if !validation.passes}
      <tr>
        <td
          class="py-2 h-10 transition-colors {validation.checkLength
            ? 'text-green-300'
            : ''}">
          {#if username.length > 0}
            {@html validation.checkLength
              ? circleCheckmarkIcon()
              : circleErrorIcon()}
          {:else}
            {@html emptyCircleIcon()}
          {/if}
        </td>
        <td class="p-2">Between 2-50 characters</td>
      </tr>
      <tr>
        <td
          class="py-2 h-10 transition-colors {validation.checkCharacters
            ? 'text-green-300'
            : ''}">
          {#if username.length > 0}
            {@html validation.checkCharacters
              ? circleCheckmarkIcon()
              : circleErrorIcon()}
          {:else}
            {@html emptyCircleIcon()}
          {/if}
        </td>
        <td class="p-2">Only letters, numbers, dashes and underscores</td>
      </tr>
    {:else}
      <tr class={username.length > 0 ? 'visible' : 'invisible'}>
        <td
          class="py-2 h-10 transition-colors {validation
            ? 'text-green-700'
            : 'text-orange-500'} ">
          {@html validation ? circleCheckmarkIcon() : circleErrorIcon()}
        </td>
        <td class="p-2 {validation ? 'font-semibold' : ''}"
          >{validation ? 'Good enough for us!' : 'Keep working on it...'}</td>
      </tr>
    {/if}
  </table>
</div>
