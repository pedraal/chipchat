export default function () {
  const chatError = useState<string>('chatError', () => '')

  return {
    chatError,
  }
}
