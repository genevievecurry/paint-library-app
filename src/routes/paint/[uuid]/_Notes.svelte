<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { connect, timeAgo } from '$lib/utility';
  import { warningNotifier } from '$lib/notifier';
  import { adminIcon, approveIcon, removeIcon } from '$lib/icons';
  import { session } from '$app/stores';
  import Dialog from '$lib/components/Dialog.svelte';

  export let notes: NoteComponent[];
  export let paintUuid: string;

  const dispatch = createEventDispatcher();

  let content: string;
  let approved: boolean;
  let parentNoteId: number;
  let deleteNoteId: number;
  let updateNoteId: number;

  let showDeleteNoteDialog = false;

  $: formData = {
    content: content,
    parentNoteId: parentNoteId,
    approved: approved,
    id: updateNoteId,
  };

  $: notes = notes;

  async function deleteNote() {
    const response = await connect({
      method: 'DELETE',
      endpoint: `/paint/${paintUuid}/note.json`,
      data: deleteNoteId,
    });

    showDeleteNoteDialog = false;

    if (response.ok) {
      dispatch('update', 'Successfully deleted note.');
    } else {
      warningNotifier(
        `Uh oh, there was a problem deleting note. ${response.statusText}.`,
      );
    }
  }

  async function handlePost() {
    const response = await connect({
      method: 'post',
      endpoint: `/paint/${paintUuid}/note.json`,
      data: formData,
    });

    if (response.status === 200) {
      return response.json();
    } else {
      warningNotifier(response.statusText);
    }
  }

  async function updateApproved() {
    const promise = await handlePost();

    if (promise.id) {
      dispatch('update', `Note ${approved ? 'approved' : 'unapproved'}.`);
      updateNoteId = null;
      approved = null;
    }
  }

  async function submit(node) {
    const handler = async (event: Event) => {
      event.preventDefault();
      const promise = await handlePost();

      if (promise.id) {
        content = '';
        dispatch(
          'update',
          'Posted! Your comment is now pending moderator approval.',
        );
      }
    };

    node.addEventListener('submit', handler);
    return {
      destroy() {
        node.removeEventListener('submit', handler);
      },
    };
  }
</script>

{#if showDeleteNoteDialog}
  <Dialog
    on:close={() => (showDeleteNoteDialog = false)}
    on:close={() => (deleteNoteId = null)}
    on:confirm={deleteNote}>
    <span slot="title">Are you sure you want to delete this note?</span>
    <p slot="confirmationText"> This cannot be undone.</p>
  </Dialog>
{/if}

<section class="mt-8">
  <h2 class="font-bold text-2xl mb-4">Artist Notes</h2>

  {#if $session.user}
    <div>
      <p
        >Do you have any notes or experiences to share about this paint? Would
        you recommend it? Are there alternatives you prefer? Any tips about how
        to use it, store it, buy it? Share your thoughts with fellow artists!
      </p>
      <p class="text-sm text-gray-500 mt-1">
        (Your note submission will be reviewed before its publicly visible, so
        keep things civil.)</p>
    </div>
    <form use:submit class="mt-4 mb-6">
      <textarea
        placeholder="Add a note"
        class="block w-full py-2 px-3 border-2 border-black focus:outline-none focus:ring-lime-500 focus:border-lime-500"
        bind:value={content} />
      <button type="submit" class="pop py-1 px-3 mt-2 text-lg">Post</button>
    </form>
  {/if}

  {#if notes.length > 0}
    {#each notes as note}
      {#if note.approved || $session.user?.role === 'ADMIN' || $session.user?.uuid === note.author.uuid}
        <div
          id="note-{note.id}"
          class="my-4 border {note.approved
            ? 'border-gray-400'
            : 'border-orange-600 bg-orange-100'}">
          <div class="flex justify-between items-center text-sm mb-2 px-3">
            <div class="leading-tight pt-3">
              @<a href="/@{note.author.username}" class="decorate-link"
                >{note.author?.username}</a>
              {#if note.author.role === 'ADMIN'}
                {@html adminIcon('h-3 w-3 inline-block')}
              {:else}
                &bull;
              {/if}
              <span class="text-gray-500 font-light"
                >posted {timeAgo(note.createdAt)}.</span>

              {#if !note.approved}
                <span>(Not public - pending moderator approval!)</span>
              {/if}
            </div>
            <div class="">
              {#if $session.user?.role === 'ADMIN'}
                <button
                  type="button"
                  class="pop p-1 text-xs {note.approved
                    ? 'active'
                    : 'text-orange-800'}"
                  on:click={() => (
                    (updateNoteId = note.id), (approved = !note.approved)
                  )}
                  on:click={updateApproved}>
                  {@html approveIcon('h-4 w-4')}
                </button>
              {/if}
              {#if $session.user?.role === 'ADMIN' || $session.user?.uuid === note.author.uuid}
                <button
                  type="button"
                  class="pop inline-flex items-center px-2 py-1 text-xs"
                  on:click={() => (deleteNoteId = note.id)}
                  on:click={() => (showDeleteNoteDialog = true)}>
                  {@html removeIcon('h-4 w-4 mr-1')}
                  <span>Delete</span>
                </button>
              {/if}
            </div>
          </div>
          <div class="p-3 pt-2">{note.content}</div>
        </div>
      {/if}
    {/each}
  {:else}
    <span class="block my-4 text-gray-400 font-light">
      No artist notes have been added yet.
    </span>
  {/if}
</section>
