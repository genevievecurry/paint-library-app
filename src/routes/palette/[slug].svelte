<script context="module" lang="ts">
  export async function load({ session, page, fetch }) {
    const { user } = session;
    const url = `/palette/${page.params.slug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          slug: page.params.slug,
          paletteData: await response.json(),
          user
        },
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Dialog from '$lib/components/Dialog.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import PaletteForm from '$lib/components/PaletteForm.svelte';
  import { clickOutside } from '$lib/actions';
  import { connect } from '$lib/utility';
  import { session } from '$app/stores';
  import { goto } from '$app/navigation';
  
  export let slug: string;
  export let paletteData: PaletteComponent;
  export let user: User;

  $: palette = paletteData;
  $: title = palette.title || '';
  $: owner = palette.owner || {};
  $: description = palette.description || '';
  $: paintsInPalette = palette.paintsInPalette || [];

  const editable = user && (owner?.uuid === user.uuid|| user.role === 'ADMIN');

  let editMenuOpen = false;
  let showEditPaletteModal = false
  let showDeletePaletteDialog = false;

  async function deletePalette() {
    const response = await connect({method:'DELETE', endpoint:`/palette/${slug}.json`})

    if (response.ok) {
      goto(`/@${$session.user.username}`);

      $session.notification = {
        type: 'success',
        visible: true,
        message: `Successfully deleted ${title}.`
      }
    } else {
      $session.notification = {
        type: 'error',
        visible: true,
        message: `Uh oh, there was a problem deleting ${title}. ${response.statusText}`
      }
    }
  }

  function handleEditedPalette() {
    palette = palette;
    showEditPaletteModal = false;
  }
</script>


{#if showEditPaletteModal && editable}
  <Modal on:close={() => (showEditPaletteModal = false)} title="Edit Palette">
    <div class="col-span-12">
      <PaletteForm {palette} on:success={handleEditedPalette}/>
    </div>
  </Modal>
{/if}

{#if showDeletePaletteDialog && editable}
  <Dialog on:close={() => (showDeletePaletteDialog = false)} on:confirm={deletePalette}>
    <div slot="confirmationText">
      <p class="font-bold">Are you sure you want to delete this palette?</p> 
      <p class="my-2">This cannot be undone. The good news is that you can easily make another palette just like it if you have regrets!</p>
    </div>
  </Dialog>
{/if}

<div class="container mx-auto px-4 sm:px-6">
  <Header {title} {owner} {description}>
    {#if editable}
      <div class="relative inline-block text-left">
        <div
          use:clickOutside={{
            enabled: editMenuOpen,
            cb: () => (editMenuOpen = false),
          }}>
          <button
            type="button"
            class="action-link inline-flex justify-center p-2 text-sm font-medium border border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            id="menu-button"
            aria-expanded={editMenuOpen}
            aria-haspopup="true"
            on:click={() => (editMenuOpen = true)}
          >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>
        </div>
      
      {#if editMenuOpen}
        <div
          class="transition ease-out duration-100 {editMenuOpen
            ? 'transform opacity-100 scale-100'
            : 'transform opacity-0 scale-95'} z-10 border border-black origin-top-right absolute right-0 mt-2 w-64 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1">
          <span
            on:click={() => showEditPaletteModal = true}
            class="action-link block px-4 py-2 text-sm flex"
            role="menuitem"
            tabindex="-1">
            Edit
          </span>
            <span
              on:click={() => showDeletePaletteDialog = true}
              class="action-link delete block px-4 py-2 text-sm flex"
              role="menuitem"
              tabindex="-1">
   
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>

                <span class="block">Delete Palette</span>
            </span>
        </div>
      {/if}
    </div>
    {/if}
  </Header>

  <section
    class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
    {#each paintsInPalette as paintInPalette}
      <div class="border border-black p-1">
        <a sveltekit:prefetch href={`/paint/${paintInPalette.paint.slug}`}>
          <div
            class="w-full h-32"
            style={`background-color: ${paintInPalette.paint.hex}`} />
        </a>
      </div>
    {/each}
  </section>
</div>
