FROM ubuntu:22.04

# Install texlive (6GB + 300MB)
RUN apt-get update \
 && apt-get install -y \
    texlive-full \
    texlive-xetex
    