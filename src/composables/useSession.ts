import { computed, ref, watch } from 'vue'

function createSessionId() {
  return `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`
}

function getStoredSessionId() {
  const existing = localStorage.getItem('gm_session_id')
  if (existing) {
    return existing
  }
  const created = createSessionId()
  localStorage.setItem('gm_session_id', created)
  return created
}

function nicknameKey(slug: string) {
  return `gm_nickname_${slug}`
}

export function useSession(slugRef?: { value: string }) {
  const sessionId = ref(getStoredSessionId())
  const nickname = ref('')

  const slug = computed(() => slugRef?.value || '')

  function loadNickname() {
    if (!slug.value) {
      nickname.value = ''
      return
    }
    nickname.value = localStorage.getItem(nicknameKey(slug.value)) || ''
  }

  function saveNickname(value: string) {
    if (!slug.value) {
      return
    }
    const trimmed = value.trim()
    nickname.value = trimmed
    localStorage.setItem(nicknameKey(slug.value), trimmed)
  }

  watch(slug, loadNickname, { immediate: true })

  return {
    sessionId,
    nickname,
    saveNickname,
  }
}
