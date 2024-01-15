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
            <div className="border border-neutral-100 bg-neutral-950 rounded w-full">
              <div className="flex p-4 items-center">
                <Img src="/favicon.svg" alt="Logo" aria-hidden={true} width={48} height={48} />

                <Heading as="h1" ml={4} className="text-xl font-bold text-center text-neutral-100">
                  {title}
                </Heading>
              </div>

              <Hr className="border-neutral-800" />

              <div className="flex space-y-2 p-4 w-full flex-col">{children}</div>
            </div>
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
