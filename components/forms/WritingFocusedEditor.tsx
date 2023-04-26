import { CountExtension } from "@remirror/extension-count"
import { Node } from "@remirror/pm/dist-types/model"
import {
  CommandButtonGroup,
  CommandMenuItem,
  DecreaseFontSizeButton,
  DropdownButton,
  IncreaseFontSizeButton,
  EditorComponent,
  FindReplaceComponent,
  IndentationButtonGroup,
  Remirror,
  TextAlignmentButtonGroup,
  ToggleBoldButton,
  ToggleItalicButton,
  ToggleStrikeButton,
  ToggleSubscriptButton,
  ToggleSuperscriptButton,
  Toolbar,
  useActive,
  useCommands,
  useRemirror,
} from "@remirror/react"
import dynamic from "next/dynamic"
import {
  useCallback,
  useState
} from "react"
import {
  RemirrorEventListenerProps,
  prosemirrorNodeToHtml
} from "remirror"
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  FontFamilyExtension,
  FontSizeExtension,
  ItalicExtension,
  NodeFormattingExtension,
  SubExtension,
  SupExtension,
  StrikeExtension,
} from "remirror/extensions"
import { FindExtension } from '@remirror/extension-find'
import useDebug from "../../hooks/useDebug"
import { InlineTextareaProps } from "../../types/props"
import { SaveIcon } from "../ui/icons"
import ShrinkableIconButton from "../ui/shrinkableIconButton"
const {debug, todo} = useDebug("InlineTextArea")

const WritingFocusedEditor = ({
  placeholder,
  content,
  setContent,
  setValid,
  onSave,
  onChange,
  words,
  setWords,
  maxChar = -1,
  showCount = false
}: InlineTextareaProps) => {
  const [showSave, setShowSave] = useState(false)
  const [isValid, setIsValid] = useState(false)

  let extensions = [
    new CountExtension(),
    new BoldExtension(),
    new BlockquoteExtension(),
    new BulletListExtension(),
    new FindExtension(),
    new FontFamilyExtension(),
    new FontSizeExtension({ defaultSize: '12', unit: 'px' }),
    new ItalicExtension(),
    new NodeFormattingExtension(),
    new StrikeExtension(),
    new SubExtension(),
    new SupExtension(),
  ]

  const { manager, state } = useRemirror({
    extensions: useCallback(() => [...extensions], []),
    stringHandler: "html",
    content: content || "",
  })

  const validate = (b:boolean) => {
    setIsValid(() => b)
    if (setValid) {
      setValid(() => b)
    }
  }

  const htmlString = (doc: Node | undefined) =>
    doc ? prosemirrorNodeToHtml(doc) : null

  const onContentChange = (params: RemirrorEventListenerProps<Remirror.Extensions>) => {
    const newContent = htmlString(params.tr?.doc)
    const didChange = (content||'').indexOf(newContent||'') < 0
    debug('onChange', {content, newContent, index:(content||'').indexOf(newContent||'') < 0, didChange})
    if (!didChange) {
      return
    }

    const wordCount = manager.getExtension(CountExtension).getWordCount()
    const isValid = manager.getExtension(CountExtension).isCountValid()
    
    if (setContent) {
      debug('setContent')
      setContent(newContent!)
    }
    if (setWords){
      debug('setWords')
      setWords(wordCount)
    }
    setShowSave(true)
    
  }

  const onClickSave = () => {
    if (onSave) onSave()
    setShowSave(() => false)
  }

  return (
      <div className="remirror-theme flex-1 text-base-content">
        <Remirror
          manager={manager}
          initialContent={state}
          onChange={(p) => onContentChange(p)}
          autoFocus
          classNames={['relative']}
        >
          <div className="sticky top-0">
            <Toolbar>

              <CommandButtonGroup>
                <DecreaseFontSizeButton />
                <FontSizeButtons />
                  <FontFamilyButtons />
                <IncreaseFontSizeButton />
              </CommandButtonGroup>

              <CommandButtonGroup>
                <ToggleBoldButton />
                <ToggleItalicButton />
                <ToggleSuperscriptButton />
                <ToggleSubscriptButton />
                <ToggleStrikeButton />
              </CommandButtonGroup>

              <TextAlignmentButtonGroup />
              <IndentationButtonGroup />
              <LineHeightButtonDropdown />

              <CommandButtonGroup className="absolute right-0 flex space-x-4">
                {words && 
                  <div className="text-sm">Words: {words}</div>
                }
                <ShrinkableIconButton label="" icon={SaveIcon} onClick={onSave}  className="btn btn-sm btn-primary" />
              </CommandButtonGroup>
            </Toolbar>
            <FindReplaceComponent />
          </div>
          <EditorComponent />

        </Remirror>
      </div>
  )
}

const FONT_FAMILIES: Array<[React.CSSProperties['fontFamily'], string]> = [
  ['', 'None'],
  ['serif', 'Serif'],
  ['sans-serif', 'San serif'],
  ['cursive', 'Cursive'],
  ['fantasy', 'Fantasy'],
  ['ibarra', 'Ibarra'],
]

const FontFamilyButtons = () => {
  const { setFontFamily } = useCommands()
  const active = useActive()
  return (
    <CommandButtonGroup>
      <DropdownButton aria-label='Font family' icon='text'>
        {FONT_FAMILIES.map(([fontFamily, label]) => (
          <CommandMenuItem
            key={fontFamily}
            commandName='setFontFamily'
            onSelect={() => setFontFamily(fontFamily as string)}
            enabled={setFontFamily.enabled(fontFamily as string)}
            active={active.fontFamily({ fontFamily })}
            label={<span style={{ fontFamily }}>{label}</span>}
          />
        ))}
      </DropdownButton>
    </CommandButtonGroup>
  )
}

const FONT_SIZES = ['8', '10', '12', '14', '16', '18', '24', '30', '48', '64'];

const FontSizeButtons = () => {
  const { setFontSize } = useCommands()
  const { fontSize } = useActive()
  return (
    <DropdownButton aria-label='Set font size' icon='fontSize'>
      {FONT_SIZES.map((size) => (
        <CommandMenuItem
          key={size}
          commandName='setFontSize'
          onSelect={() => setFontSize(size)}
          enabled={setFontSize.enabled(size)}
          active={fontSize({ size })}
          label={size}
          icon={null}
          displayDescription={false}
        />
      ))}
    </DropdownButton>
  )
}

const LineHeightButtonDropdown = () => {
  const { setLineHeight } = useCommands()
  return (
    <CommandButtonGroup>
      <DropdownButton aria-label='Line height' icon='lineHeight'>
        <CommandMenuItem
          commandName='setLineHeight'
          onSelect={() => setLineHeight(0)}
          enabled={setLineHeight.enabled(0)}
          label='Normal'
        />
        <CommandMenuItem
          commandName='setLineHeight'
          onSelect={() => setLineHeight(1)}
          enabled={setLineHeight.enabled(1)}
          label='Narrow'
        />
        <CommandMenuItem
          commandName='setLineHeight'
          onSelect={() => setLineHeight(2)}
          enabled={setLineHeight.enabled(2)}
          label='Wide'
        />
      </DropdownButton>
    </CommandButtonGroup>
  )
}

export default dynamic(() => Promise.resolve(WritingFocusedEditor), { ssr: false })
