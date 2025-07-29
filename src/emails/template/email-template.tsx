import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  username?: string;
  actionLink?: string;
  previewText?: string;
  header?: string;
  buttonText?: string;
  emailText?: string;
}

export function EmailTemplate({
  username,
  actionLink,
  previewText = "Boilerplate Email",
  header = "Boilerplate Email",
  buttonText = "Button Text",
  emailText = "Email Text",
}: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {header}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {username}, {emailText}.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded-md text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={actionLink}
              >
                {buttonText}
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Or copy and paste this URL into your browser:{" "}
              <Link href={actionLink} className="text-blue-600 no-underline">
                {actionLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{" "}
              <span className="text-black">{username}</span>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

EmailTemplate.PreviewProps = {
  username: "Example User",
  actionLink: "https://example.com",
  previewText: "Example Preview Text",
  header: "Example Header",
  buttonText: "Example Button Text",
  emailText: "Example Email Text",
} as EmailTemplateProps;

export default EmailTemplate;
