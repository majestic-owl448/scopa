import { useNavigate } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-base font-bold text-fcc-yellow uppercase tracking-wide border-b border-fcc-quaternary-bg pb-1">{title}</h2>
      {children}
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-fcc-secondary-fg leading-relaxed">{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="text-sm text-fcc-secondary-fg leading-relaxed">{children}</li>
}

export default function Rules() {
  const navigate = useNavigate()
  const { t } = useTranslation('rules')

  return (
    <div className="max-w-lg mx-auto p-4 pb-12 flex flex-col gap-6">
      <div className="flex items-center gap-4 pt-2">
        <button onClick={() => navigate('/')} className="text-fcc-quaternary-fg hover:text-white">{t('common:back')}</button>
        <h1 className="text-2xl font-bold">{t('page_title')}</h1>
      </div>

      <Section title={t('the_deck_title')}>
        <P>{t('the_deck_body')}</P>
      </Section>

      <Section title={t('goal_title')}>
        <P>{t('goal_body')}</P>
      </Section>

      <Section title={t('setup_title')}>
        <P>{t('setup_body')}</P>
      </Section>

      <Section title={t('playing_title')}>
        <ul className="flex flex-col gap-1.5 list-disc list-inside">
          <Li>{t('playing_select')}</Li>
          <Li><Trans ns="rules" i18nKey="playing_capture" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="playing_discard" components={[<strong key="0" />]} /></Li>
          <Li>{t('playing_redeal')}</Li>
        </ul>
      </Section>

      <Section title={t('scopa_title')}>
        <P><Trans ns="rules" i18nKey="scopa_body" components={[<strong key="0" className="text-fcc-yellow" />]} /></P>
      </Section>

      <Section title={t('end_title')}>
        <P>{t('end_body')}</P>
      </Section>

      <Section title={t('scoring_title')}>
        <ul className="flex flex-col gap-1.5 list-disc list-inside">
          <Li><Trans ns="rules" i18nKey="scoring_scope" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="scoring_carte" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="scoring_ori" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="scoring_settebello" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="scoring_primiera" components={[<strong key="0" />]} /></Li>
        </ul>
      </Section>

      <Section title={t('variants_title')}>
        <ul className="flex flex-col gap-1.5 list-disc list-inside">
          <Li><Trans ns="rules" i18nKey="variant_rosmarino" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="variant_re_bello" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="variant_settanta" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="variant_napola" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="variant_scopa_d_assi" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="variant_inversa" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="variant_quindici" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="variant_undici" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="variant_veneto" components={[<strong key="0" />]} /></Li>
          <Li><Trans ns="rules" i18nKey="variant_milano" components={[<strong key="0" />]} /></Li>
        </ul>
      </Section>
    </div>
  )
}
