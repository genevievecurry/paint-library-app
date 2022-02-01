<script lang="ts">
  import {
    circleCheckmarkIcon,
    circleErrorIcon,
    emptyCircleIcon,
  } from '$lib/icons';

  export let validation;
  export let password;
</script>

<div>
  <span class="block font-bold">Password Guidelines</span>
  <small class="leading-5 block my-1 text-sm text-gray-500">
    Pick a good one! Try the
    <a
      href="https://gross-warped-trogon.gigalixirapp.com/"
      target="_blank"
      rel="noopener noreferrer"
      class="decorate-link">password generator</a
    >.
  </small>

  <table class="table-auto">
    {#if !validation.passes}
      <tr>
        <td
          class="py-2 h-10 transition-colors {validation.uppercase
            ? 'text-green-200'
            : ''}">
          {#if password.length > 0}
            {@html validation.uppercase
              ? circleCheckmarkIcon()
              : circleErrorIcon()}
          {:else}
            {@html emptyCircleIcon()}
          {/if}
        </td>
        <td class="p-2">Contains an uppercase letter</td>
      </tr>
      <tr>
        <td
          class="py-2 h-10 transition-colors {validation.lowercase
            ? 'text-green-300'
            : ''}">
          {#if password.length > 0}
            {@html validation.lowercase
              ? circleCheckmarkIcon()
              : circleErrorIcon()}
          {:else}
            {@html emptyCircleIcon()}
          {/if}
        </td>
        <td class="p-2">Contains lowercase letter</td>
      </tr>
      <tr>
        <td
          class="py-2 h-10 transition-colors {validation.digits
            ? 'text-green-400'
            : ''}">
          {#if password.length > 0}
            {@html validation.digits
              ? circleCheckmarkIcon()
              : circleErrorIcon()}
          {:else}
            {@html emptyCircleIcon()}
          {/if}
        </td>
        <td class="p-2">Contains digit</td>
      </tr>
      <tr>
        <td
          class="py-2 h-10 transition-colors {validation.special
            ? 'text-green-500'
            : ''}">
          {#if password.length > 0}
            {@html validation.special
              ? circleCheckmarkIcon()
              : circleErrorIcon()}
          {:else}
            {@html emptyCircleIcon()}
          {/if}
        </td>
        <td class="p-2">Contains special character</td>
      </tr>
      <tr>
        <td
          class="py-2 h-10 transition-colors {validation.length
            ? 'text-green-600'
            : ''}">
          {#if password.length > 0}
            {@html validation.length
              ? circleCheckmarkIcon()
              : circleErrorIcon()}
          {:else}
            {@html emptyCircleIcon()}
          {/if}
        </td>
        <td class="p-2">Between 8-24 characters</td>
      </tr>
    {:else}
      <tr>
        <td
          class="py-2 h-10 transition-colors {validation.passes
            ? 'text-green-700'
            : 'text-orange-500'} ">
          {@html validation.passes ? circleCheckmarkIcon() : circleErrorIcon()}
        </td>
        <td class="p-2 {validation.passes ? 'font-semibold' : ''}"
          >{validation.passes
            ? 'Good enough for us!'
            : 'Keep working on it...'}</td>
      </tr>
    {/if}
  </table>
</div>
