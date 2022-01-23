<script context="module" lang="ts">
  export async function load({ params, fetch }) {
    const url = `/@${params.username}/notes.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          noteData: await response.json(),
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
  import { session } from '$app/stores';
  import { timeAgo } from '$lib/utility';
  import { adminIcon, approveIcon, removeIcon } from '$lib/icons';
  import { generateUrl } from '$lib/generate';

  export let noteData;
</script>

{#if noteData.notes.length === 0}
  <span class="text-gray-400 font-light">
    This user has not yet saved any notes.
  </span>
{:else}
  <div class="container mx-auto max-w-2xl">
    {#each noteData.notes as note}
      {#if note.approved || $session.user?.role === 'ADMIN' || $session.user?.uuid === note.author.uuid}
        <div
          id="note-{note.id}"
          class="my-4 border {note.approved
            ? 'border-gray-400'
            : 'border-orange-600 bg-orange-100'}">
          <div class="text-sm mb-2 px-3">
            <div class="leading-tight pt-3">
              @<a href="/@{noteData.username}" class="decorate-link"
                >{noteData.username}</a>
              {#if note.author.role === 'ADMIN'}
                {@html adminIcon('h-3 w-3 inline-block')}
              {:else}
                &bull;
              {/if}
              <span class="text-gray-500 font-light"
                >posted {timeAgo(note.createdAt)}, about</span>
              <a
                href="{generateUrl({
                  prefix: 'paint',
                  target: note.paint,
                })}#note-{note.id}"
                class="decorate-link"
                >{note.paint.manufacturer.name}'s {note.paint.name}</a>
            </div>
            <div>
              {#if !note.approved}
                <span>(Not public - pending moderator approval!)</span>
              {/if}
            </div>
          </div>
          <div class="p-3 pt-2">{note.content}</div>
        </div>
      {/if}
    {/each}
  </div>
{/if}
