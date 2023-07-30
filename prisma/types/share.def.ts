import { Agent, Artist, Author, Book, BookStub, Character, CharacterStub, Cover, CoverStub, CreatorStub, CyfrUser, EventStub, Gallery, GalleryStub, Image, ImageStub, Post, PostStub, Share, User, UserStub } from "prisma/prismaContext"

export type ShareEngageProps = {
  creator:  CyfrUser
  share:    Share|ShareStub
}

export type SharePostProps = {
  creator:  CyfrUser
  post:     Post|PostStub
}

export type ShareImageProps = {
  creator:  CyfrUser
  image:    Image|ImageStub
}

export type ShareGalleryProps = {
  creator:  CyfrUser
  gallery:  Gallery|GalleryStub
}

export type ShareBookProps = {
  creator:  CyfrUser
  book:     Book|BookStub
}

export type ShareCharacterProps = {
  creator:    CyfrUser
  character:  Character|CharacterStub
}

export type ShareCoverProps = {
  creator:  CyfrUser
  cover:    Cover|CoverStub
}

export type ShareEventProps = {
  creator:  CyfrUser
  event:    Event
}

export type ShareStub = Share & {
  creator:    CreatorStub
  gallery?:   GalleryStub
  book?:      BookStub
  character?: CharacterStub
  image?:     ImageStub
  cover?:     CoverStub
  post?:      PostStub
  event?:     EventStub
}