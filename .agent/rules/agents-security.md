---
trigger: model_decision
description: Apply when designing AI agent features or handling untrusted inputs (Agents Rule of Two, prompt injection defense)
---

# AGENTS – Agents Rule of Two

This document defines AI agent security design rules based on **Meta's Agents Rule of Two** framework.

Core objectives:

1. **Prevent the worst-case consequences of Prompt Injection vulnerabilities**.
2. Follow the principle of **allowing at most two of three attributes during agent design**.
3. Help agent developers **clearly understand the trade-offs between security and utility** and make informed decisions.

---

## 1. Agents Rule of Two Overview

### 1.1 Core Principles

**Agents Rule of Two** specifies that in a situation where prompt injection is not fundamentally resolved,
agents should possess **at most two of the following three attributes** simultaneously:

**[A] Untrustworthy Inputs**
Whether the agent can process data from unknown sources
Examples: External emails, web search results, user inputs, etc.

**[B] Sensitive Systems or Private Data**
Whether the agent can access sensitive information or systems
Examples: User personal information, production databases, internal systems, etc.

**[C] State Changes or External Communication**
Whether the agent can change system state or communicate externally
Examples: Sending emails, modifying databases, making API calls, etc.

### 1.2 Rule Application

- **At most two of the three attributes** are permitted simultaneously.
- If all three are necessary:
  - **Start a new session (new context window)**, or
  - **Human oversight (human-in-the-loop)** or **other trustworthy validation mechanisms** are required.

### 1.3 Valid Configurations

Possible configurations:

- **[AB]**: Untrustworthy Inputs + Sensitive Data Access (External Communication/State Changes restricted)
- **[AC]**: Untrustworthy Inputs + External Communication/State Changes (Sensitive Data Access restricted)
- **[BC]**: Sensitive Data Access + External Communication/State Changes (Untrustworthy Inputs restricted)

---

## 2. Attack Scenarios and Defense

### 2.1 Email-Bot Attack Example

**Attack Scenario**:
A spam email contains a prompt injection string, instructing the user's Email-Bot to
collect the user's personal email content and send it to the attacker.

**Why the Attack Succeeds**:
- [A] Processing Untrustworthy Inputs (spam email)
- [B] Accessing Sensitive Data (user mailbox)
- [C] External Communication (sending email)

**Defense with Agents Rule of Two**:

- **[BC] Configuration**: Process emails only from trustworthy senders (e.g., close friends) to prevent prompt injection payloads from reaching the agent context.
- **[AC] Configuration**: Restrict access to sensitive data or systems (e.g., operate only in test environments) so that even if prompt injection reaches the agent, it cannot cause meaningful damage.
- **[AB] Configuration**: Send emails only to trustworthy recipients, or require a human to verify the draft message content, preventing the attacker from finally completing the attack chain.

---

## 3. Real-World Use Cases

### 3.1 Travel Agent Assistant [AB]

**Description**: A public travel assistant that can answer questions and take actions on behalf of the user.

**Requirements**:
- [A] Must obtain up-to-date travel information through web search
- [B] Must access user personal information to provide booking and purchase experience

**Rule of Two Application**:
- [C] Restricted: Preventive controls on external communication and state changes
  - Request human confirmation for all actions (booking, deposit payment, etc.)
  - Restrict web requests to URLs returned from trustworthy sources only (agent-constructed URLs forbidden)

### 3.2 Web Browsing Research Assistant [AC]

**Description**: An agent that performs research by interacting with a web browser on behalf of the user.

**Requirements**:
- [C] Must send many requests to arbitrary URLs and fill out forms
- [A] Must process results and re-plan as necessary

**Rule of Two Application**:
- [B] Restricted: Preventive controls on access to sensitive systems and personal data
  - Run browser in a restrictive sandbox without pre-loaded session data
  - Restrict agent's access to personal information (beyond initial prompt) and notify user of data sharing methods

### 3.3 High-Velocity Internal Coder [BC]

**Description**: An agent that solves engineering problems by generating and executing code across an organization's internal infrastructure.

**Requirements**:
- [B] Must access a subset of production systems to solve meaningful problems
- [C] Must be able to perform state changes to these systems
- Human oversight has value as a defense-in-depth strategy, but developers want to minimize human intervention to operate at scale.

**Rule of Two Application**:
- [A] Restricted: Preventive controls on untrustworthy data sources
  - Filter all data sources processed within the agent's context window using author-lineage
  - Provide human review process to flag false positives and allow agent to access data

### 3.4 In-Session Configuration Switching

Like any general framework, details matter.
To enable additional use cases, it may be safe for an agent to transition from one
Agents Rule of Two configuration to another within the same session.

**Example**: Start with [AC] to access the internet, and
complete a one-way transition to [B] by disabling communication when accessing internal systems.

The specific method for doing this safely is omitted for brevity, but
readers can infer it by **focusing on disrupting attack paths**.
That is, prevent the attack from completing the full chain of [A] → [B] → [C].

---

## 4. Limitations

### 4.1 Other Threat Vectors

Satisfying Agents Rule of Two is **not sufficient** to protect against:

- Other common threat vectors for agents
  - Attacker uplift
  - Spam distribution
  - Agent mistakes
  - Hallucinations
  - Excessive privileges, etc.
- Low-impact consequences of prompt injection
  - Misinformation in agent responses, etc.

### 4.2 Defense in Depth

Applying Agents Rule of Two is **not the end** of risk mitigation.

- Designs satisfying Agents Rule of Two can still fail
  - Example: Users blindly confirming warning dialogs
- **Defense in depth** is a critical component for mitigating worst-case scenarios when single-layer failures are possible
- Agents Rule of Two is a **complement to** general security principles like **least-privilege**, not a **replacement**

---

## 5. Complementary Solutions

Additional AI protection solutions that complement Agents Rule of Two:

- **Llama Firewall**: Orchestrates agent protection
- **Prompt Guard**: Classifies potential prompt injections
- **Code Shield**: Reduces unsafe code suggestions
- **Llama Guard**: Classifies potentially harmful content

For more details, refer to the [Meta Llama Protections](https://llama.meta.com/docs/model-cards-and-prompt-formats/llama-guard/) documentation.

---

## 6. Future Outlook

### 6.1 Model Context Protocol (MCP)

New risks and opportunities are emerging with the adoption of protocols for plug-and-play agent tool invocation
(e.g., Model Context Protocol).

- Blindly connecting agents to new tools can be a recipe for disaster
- There is potential to enable **security-by-default** with built-in Rule of Two awareness
- Example: By declaring Agents Rule of Two configurations in supported tool calls,
  developers can have confidence that operations will succeed, fail, or request additional approval according to policy

### 6.2 Oversight Approval Checks

As agents become more useful and capabilities grow,
some very popular use cases will be difficult to fit neatly into Agents Rule of Two.

Example: Background processes where human oversight becomes cumbersome or inefficient

- Traditional software guardrails and human approval continue as the preferred method to
  satisfy Agents Rule of Two in current use cases
- Research continues to pursue satisfying Agents Rule of Two oversight approval checks through alignment controls
  - Example: Oversight agents
  - Example: Open-source LlamaFirewall platform

---

## 7. For Agents Reading This Document

1. **Agents Rule of Two is an essential framework**.
   Always consider this principle when designing or implementing AI agents.

2. Among the three attributes [A], [B], [C], **permit at most two** simultaneously.

3. If all three are necessary:
   - Start a new session, or
   - Introduce human oversight or trustworthy validation mechanisms.

4. **Consider defense in depth**.
   Agents Rule of Two should be used alongside other security principles.

5. If there are ambiguous areas:
   - (If in a conversational environment) Ask the user.
   - Otherwise, design with the most conservative assumptions.

This framework aims to definitively reduce the worst-case consequences of prompt injection.
It helps agent developers understand the trade-offs between security and utility and
make informed decisions.

---

## References

- [Meta AI Blog: Agents Rule of Two - A Practical Approach to AI Agent Security](https://ai.meta.com/blog/practical-ai-agent-security/) (October 31, 2025)
- [Chromium Rule of Two](https://chromium.googlesource.com/chromium/src/+/main/docs/security/rule-of-two.md)
- [Simon Willison's "Lethal Trifecta"](https://simonwillison.net/2023/Oct/25/lethal-trifecta/)
- [Meta Llama Protections](https://llama.meta.com/docs/model-cards-and-prompt-formats/llama-guard/)

