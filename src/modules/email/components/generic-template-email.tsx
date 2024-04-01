import { Body, Container, Font, Head, Heading, Hr, Html, Img, Tailwind } from '@react-email/components';
import React from 'react';

type GenericEmailTemplateProps = {
  title: string;
  children: React.ReactNode;
};

export function GenericEmailTemplate({ children, title }: GenericEmailTemplateProps) {
  return (
    <Html>
      <Head>
        <title>{title}</title>
        <Font
          fontFamily="Lato"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHvxk6XweuBCY.ttf',
            format: 'truetype',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body>
        <Tailwind>
          <Container>
            <div className="w-full rounded border border-neutral-100 bg-neutral-950">
              <div className="flex items-center p-4">
                <Img src="/favicon.svg" alt="Logo" aria-hidden={true} width={48} height={48} />

                <Heading as="h1" ml={4} className="text-center text-xl font-bold text-neutral-100">
                  {title}
                </Heading>
              </div>

              <Hr className="border-neutral-800" />

              <div className="flex w-full flex-col space-y-2 p-4">{children}</div>
            </div>
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
