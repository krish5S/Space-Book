import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components";

type Props = {
  userName: string;
  resourceName: string;
  startTime: Date;
  endTime: Date;
  status: string;
};

export default function BookingConfirmation({
  userName,
  resourceName,
  startTime,
  endTime,
  status,
}: Props) {
  const dateStr = new Date(startTime).toLocaleDateString();
  const timeStr = `${new Date(startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} – ${new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f6f6f6", padding: "24px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "32px",
            maxWidth: "480px",
          }}
        >
          <Heading style={{ fontSize: "20px" }}>SpaceBook</Heading>
          <Text>Hi {userName},</Text>
          <Text>
            Your booking for <strong>{resourceName}</strong> is now{" "}
            <strong>{status}</strong>.
          </Text>
          <Section
            style={{
              backgroundColor: "#f0f0f0",
              padding: "12px 16px",
              borderRadius: "6px",
              margin: "16px 0",
            }}
          >
            <Text style={{ margin: 0 }}>📅 {dateStr}</Text>
            <Text style={{ margin: 0 }}>🕒 {timeStr}</Text>
          </Section>
          <Hr />
          <Text style={{ fontSize: "12px", color: "#888" }}>
            This is an automated message from SpaceBook. Manage your bookings in the app.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
