import { useState, type ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  RELATIONSHIP_VALUES,
  RelationshipEnum,
} from '@celebrationcountdown/shared'
import { toErrorMessage } from '../api/client'
import type { Contact, ContactInput } from '../api/contacts'
import {
  dateInputToISO,
  maskDateInput,
  validateBirthdateInput,
} from '../birthdays/dateInput'
import {
  RELATIONSHIP_LABELS,
  formatBirthdateInput,
} from '../birthdays/format'
import { Banner } from './Banner'
import { Button } from './Button'
import { ChipGroup } from './ChipGroup'
import { TextField } from './TextField'
import { colors, space, type } from '../theme/tokens'

const MAX_NAME_LENGTH = 120
const MAX_NOTES_LENGTH = 2000

const RELATIONSHIP_OPTIONS = RELATIONSHIP_VALUES.map((value) => ({
  value,
  label: RELATIONSHIP_LABELS[value],
}))

type Errors = Partial<Record<'fullName' | 'birthdate' | 'notes', string>>

type Props = {
  /** Present when editing; seeds the fields on first render. */
  initial?: Contact
  submitLabel: string
  onSubmit: (input: ContactInput) => Promise<void>
  /** Rendered under the submit button, e.g. a delete action. */
  secondaryAction?: ReactNode
}

export function BirthdayForm({
  initial,
  submitLabel,
  onSubmit,
  secondaryAction,
}: Props) {
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [birthdate, setBirthdate] = useState(
    initial ? formatBirthdateInput(initial.birthdate) : '',
  )
  const [relationship, setRelationship] = useState<RelationshipEnum>(
    initial?.relationship ?? RelationshipEnum.FRIEND,
  )
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: Errors = {
      fullName: !fullName.trim()
        ? 'Name is required'
        : fullName.trim().length > MAX_NAME_LENGTH
          ? `Name must be ${MAX_NAME_LENGTH} characters or fewer`
          : undefined,
      birthdate: validateBirthdateInput(birthdate),
      notes:
        notes.length > MAX_NOTES_LENGTH
          ? `Notes must be ${MAX_NOTES_LENGTH} characters or fewer`
          : undefined,
    }
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, value]) => !!value),
    )
    setErrors(cleaned)
    return Object.keys(cleaned).length === 0
  }

  async function submit() {
    setFormError(null)
    if (!validate()) return

    const isoBirthdate = dateInputToISO(birthdate)
    if (!isoBirthdate) return

    setSubmitting(true)
    try {
      await onSubmit({
        fullName: fullName.trim(),
        birthdate: isoBirthdate,
        relationship,
        notes: notes.trim() || null,
      })
    } catch (caught) {
      setFormError(toErrorMessage(caught))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={styles.form}>
      {formError ? <Banner tone="error" message={formError} /> : null}

      <TextField
        label="Name"
        placeholder="Ada Lovelace"
        autoCapitalize="words"
        autoCorrect={false}
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
      />

      <TextField
        label="Birthday"
        placeholder="MM/DD/YYYY"
        keyboardType="number-pad"
        maxLength={10}
        value={birthdate}
        onChangeText={(next) => setBirthdate(maskDateInput(next))}
        error={errors.birthdate}
      />

      <ChipGroup
        label="Relationship"
        options={RELATIONSHIP_OPTIONS}
        value={relationship}
        onChange={setRelationship}
      />

      <TextField
        label="Notes"
        placeholder="Loves pottery, hiking, and strong coffee"
        multiline
        value={notes}
        onChangeText={setNotes}
        error={errors.notes}
        style={styles.notes}
      />
      <Text style={styles.hint}>
        Interests and gift ideas, used later to suggest presents.
      </Text>

      <Button
        label={submitLabel}
        onPress={submit}
        loading={submitting}
        style={styles.submit}
      />
      {secondaryAction}
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    gap: space.md,
  },
  notes: {
    minHeight: 104,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  hint: {
    ...type.caption,
    fontWeight: '400',
    color: colors.inkSoft,
    marginTop: -space.sm,
  },
  submit: {
    marginTop: space.sm,
  },
})
