<script lang="ts" context="module">
  import '../styles/global.css';
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page }) {
    return {
      props: {
        path: page.path,
      },
    };
  }
</script>

<div class="container mx-auto px-4">
  <slot />
</div>
